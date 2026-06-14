import { useState, useEffect } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { getDoc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, propertiesDocRef, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const emptyProperty = {
  title: '', dormitorios: '', banos: '', m2: '', precio: '',
  ubicacion: '', ubicacionKey: '', barrio: '', barrioKey: '',
  tipo: 'venta', descripcion: '', descripcionExtra: '',
  mapsQuery: '', areaConstruida: '', areaTerreno: '',
  ciudad: '', region: '', pais: 'Argentina',
  image: '', images: [],
};

const ALLOWED_ADMINS = ['ponce15nicolas@gmail.com', 'azulparrastr@gmail.com'];

export default function AdminPanel({ onClose, baseProperties }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProperty);
  const [saved, setSaved] = useState(false);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [dataError, setDataError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    let unsubscribe = null;
    let alive = true;

    const loadProperties = async () => {
      try {
        const snapshot = await getDoc(propertiesDocRef);
        if (!alive) return;

        if (snapshot.exists() && Array.isArray(snapshot.data()?.properties)) {
          setProperties(snapshot.data().properties);
        } else {
          setProperties(baseProperties);
        }

        unsubscribe = onSnapshot(
          propertiesDocRef,
          (liveSnapshot) => {
            const remoteProperties = liveSnapshot.exists() ? liveSnapshot.data()?.properties : null;
            if (Array.isArray(remoteProperties)) {
              setProperties(remoteProperties);
            }
          },
          (error) => {
            console.error('Firestore live sync error:', error);
            setDataError('No se pudo mantener la sincronización con Firestore');
          }
        );
      } catch (err) {
        console.error('Firestore load error:', err);
        setDataError('No se pudieron cargar las propiedades desde Firestore');
        setProperties(baseProperties);
      } finally {
        if (alive) setLoadingProperties(false);
      }
    };

    loadProperties();

    return () => {
      alive = false;
      if (unsubscribe) unsubscribe();
    };
  }, [baseProperties]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (!user) {
        setAuthenticated(false);
        return;
      }

      if (user.email && ALLOWED_ADMINS.includes(user.email)) {
        setAuthenticated(true);
        setAuthError(null);
        return;
      }

      await signOut(auth);
      setAuthenticated(false);
      setAuthError('Cuenta no autorizada');
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setAuthenticating(true);
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Google Sign-In error:', err);
      setAuthError(err.message || 'Error al iniciar sesión con Google');
    } finally {
      setAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setAuthenticated(false);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const save = (list) => {
    setDoc(
      propertiesDocRef,
      {
        properties: list,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    )
      .then(() => {
        setProperties(list);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      })
      .catch((err) => {
        console.error('Firestore save error:', err);
        setDataError('No se pudieron guardar los cambios en Firestore');
      });
  };

  const handleEdit = (prop) => {
    setEditing(prop.id);
    setForm({ ...prop });
  };

  const handleNew = () => {
    const newId = Date.now();
    setEditing(newId);
    setForm({ ...emptyProperty, id: newId });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const fileRef = ref(storage, `properties/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      console.error("Error uploading cover image:", err);
      setUploadError("Error al subir la imagen de portada");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveCover = () => {
    setForm((f) => ({ ...f, image: '' }));
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);
    setUploadError(null);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const fileRef = ref(storage, `properties/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        uploadedUrls.push(url);
      }
      setForm((f) => ({
        ...f,
        images: [...(Array.isArray(f.images) ? f.images : []), ...uploadedUrls]
      }));
    } catch (err) {
      console.error("Error uploading gallery images:", err);
      setUploadError("Error al subir una o más imágenes de la galería");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveGalleryImage = (indexToRemove) => {
    setForm((f) => ({
      ...f,
      images: (Array.isArray(f.images) ? f.images : []).filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSaveProperty = () => {
    const exists = properties.find((p) => p.id === form.id);
    let updated;
    if (exists) {
      updated = properties.map((p) => p.id === form.id ? { ...form } : p);
    } else {
      updated = [...properties, { ...form }];
    }
    save(updated);
    setEditing(null);
  };

  const handleDelete = (id) => {
    if (!confirm('¿Eliminar esta propiedad?')) return;
    save(properties.filter((p) => p.id !== id));
    if (editing === id) setEditing(null);
  };

  const inputClass = "border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 w-full";
  const labelClass = "text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block";

  if (!authenticated) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 w-[90%] max-w-sm flex flex-col gap-4 shadow-2xl">
          <h2 className="font-heading font-bold text-xl text-gray-900 text-center">
            Panel de administración
          </h2>

          <p className="text-gray-500 text-xs text-center leading-relaxed">
            Acceso restringido a la cuenta autorizada.
          </p>

          <button
            onClick={handleGoogleLogin}
            disabled={authenticating}
            className="flex items-center justify-center gap-3 bg-white text-gray-700
                       border border-gray-300 rounded-lg px-4 py-2
                       hover:bg-gray-50 transition-colors"
          >
            {authenticating ? (
              <span className="animate-spin h-4 w-4 border-2 border-t-gray-700 rounded-full"></span>
            ) : (
              <>
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  className="h-4 w-4"
                />
                <span>Iniciar sesión con Google</span>
              </>
            )}
          </button>

          {authError && (
            <p className="text-red-500 text-xs text-center">{authError}</p>
          )}

          {currentUser && !authenticated && !authError && (
            <p className="text-gray-400 text-xs text-center">
              Verificando acceso de {currentUser.email}...
            </p>
          )}

          <button onClick={onClose} className="text-gray-400 text-xs text-center hover:text-gray-600 border-0 bg-transparent cursor-pointer">
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  if (loadingProperties) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 w-[90%] max-w-sm text-center shadow-2xl">
          <div className="animate-spin h-8 w-8 border-2 border-t-[#d4af37] border-gray-200 rounded-full mx-auto mb-4" />
          <p className="text-gray-700 text-sm font-semibold">Cargando propiedades desde Firestore...</p>
          {dataError && <p className="text-red-500 text-xs mt-3">{dataError}</p>}
          <button onClick={onClose} className="mt-5 text-gray-400 text-xs hover:text-gray-600 border-0 bg-transparent cursor-pointer">
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 overflow-y-auto">
      <div className="max-w-5xl mx-auto my-10 bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <h2 className="font-heading font-bold text-xl text-gray-900">
            <i className="fas fa-cog text-[#d4af37] mr-2"></i>
            Panel de administración
          </h2>
          <div className="flex items-center gap-3">
            {saved && <span className="text-green-500 text-sm font-semibold">✓ Guardado</span>}
            {dataError && <span className="text-red-500 text-sm font-semibold">{dataError}</span>}
            <button onClick={handleNew} className="px-4 py-2 bg-[#d4af37] text-white text-sm font-semibold rounded-lg border-0 cursor-pointer hover:bg-gray-900 transition-colors">
              + Nueva propiedad
            </button>
            <button onClick={handleLogout} className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-semibold rounded-lg border-0 cursor-pointer hover:bg-gray-200 transition-colors">
              Cerrar sesión
            </button>
            <button onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-semibold rounded-lg border-0 cursor-pointer hover:bg-gray-200 transition-colors">
              Cerrar
            </button>
          </div>
        </div>

        <div className="flex">

          {/* Lista de propiedades */}
          <div className="w-72 border-r border-gray-100 p-4 flex flex-col gap-2 min-h-[600px]">
            {properties.map((p) => (
              <div
                key={p.id}
                onClick={() => handleEdit(p)}
                className={`p-3 rounded-xl cursor-pointer transition-colors ${editing === p.id ? 'bg-[#d4af37]/10 border border-[#d4af37]' : 'hover:bg-gray-50 border border-transparent'}`}
              >
                <p className="text-sm font-semibold text-gray-800 truncate">{p.title || 'Sin título'}</p>
                <p className="text-xs text-gray-400">{p.tipo} · {p.ubicacion}</p>
              </div>
            ))}
          </div>

          {/* Formulario */}
          {editing !== null ? (
            <div className="flex-1 p-8 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">

                <div className="col-span-2">
                  <label className={labelClass}>Título</label>
                  <input name="title" value={form.title} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Tipo</label>
                  <select name="tipo" value={form.tipo} onChange={handleChange} className={inputClass}>
                    <option value="venta">Venta</option>
                    <option value="alquiler">Alquiler</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Precio</label>
                  <input name="precio" type="number" value={form.precio} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Dormitorios</label>
                  <input name="dormitorios" type="number" value={form.dormitorios} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Baños</label>
                  <input name="banos" type="number" value={form.banos} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>M²</label>
                  <input name="m2" type="number" value={form.m2} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Área construida</label>
                  <input name="areaConstruida" value={form.areaConstruida} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Área terreno</label>
                  <input name="areaTerreno" value={form.areaTerreno} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Ubicación</label>
                  <input name="ubicacion" value={form.ubicacion} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Ubicación Key</label>
                  <input name="ubicacionKey" value={form.ubicacionKey} onChange={handleChange} className={inputClass} placeholder="ej: resistencia" />
                </div>

                <div>
                  <label className={labelClass}>Barrio</label>
                  <input name="barrio" value={form.barrio} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Barrio Key</label>
                  <input name="barrioKey" value={form.barrioKey} onChange={handleChange} className={inputClass} placeholder="ej: belgrano" />
                </div>

                <div>
                  <label className={labelClass}>Ciudad</label>
                  <input name="ciudad" value={form.ciudad} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Región</label>
                  <input name="region" value={form.region} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>País</label>
                  <input name="pais" value={form.pais} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Maps Query</label>
                  <input name="mapsQuery" value={form.mapsQuery} onChange={handleChange} className={inputClass} placeholder="ej: Cangallo+1615+Resistencia" />
                </div>

                <div className="col-span-2">
                  <label className={labelClass}>Descripción corta</label>
                  <input name="descripcion" value={form.descripcion} onChange={handleChange} className={inputClass} />
                </div>

                <div className="col-span-2">
                  <label className={labelClass}>Descripción completa</label>
                  <textarea name="descripcionExtra" value={form.descripcionExtra} onChange={handleChange} rows={5} className={inputClass + ' resize-none'} />
                </div>

                <div className="col-span-2 flex flex-col gap-4">
                  <div>
                    <label className={labelClass}>Imagen de portada</label>
                    {form.image ? (
                      <div className="relative w-full max-w-sm rounded-xl overflow-hidden shadow-md group border border-gray-100 mb-2">
                        <img src={form.image} alt="Portada" className="w-full h-48 object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={handleRemoveCover}
                            className="p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors cursor-pointer border-0"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#d4af37] bg-gray-50 hover:bg-[#d4af37]/5 rounded-xl p-6 cursor-pointer transition-colors duration-200">
                        <i className="fas fa-image text-gray-400 text-3xl mb-2"></i>
                        <span className="text-sm font-semibold text-gray-600">Subir imagen de portada</span>
                        <span className="text-xs text-gray-400 mt-1">PNG, JPG o WebP</span>
                        <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                      </label>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Imágenes de la galería (Múltiples)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                      {(Array.isArray(form.images) ? form.images : []).map((img, idx) => (
                        <div key={idx} className="relative aspect-video rounded-lg overflow-hidden group shadow-sm border border-gray-100">
                          <img src={img} alt={`Galería ${idx}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(idx)}
                              className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors cursor-pointer border-0 text-xs"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#d4af37] bg-gray-50 hover:bg-[#d4af37]/5 rounded-lg aspect-video cursor-pointer transition-colors duration-200">
                        <i className="fas fa-plus text-gray-400 text-lg mb-1"></i>
                        <span className="text-xs font-semibold text-gray-500">Agregar</span>
                        <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
                      </label>
                    </div>
                    {uploading && (
                      <div className="flex items-center gap-2 text-xs text-[#d4af37]">
                        <span className="animate-spin h-3.5 w-3.5 border-2 border-t-[#d4af37] rounded-full"></span>
                        <span>Subiendo imágenes...</span>
                      </div>
                    )}
                    {uploadError && (
                      <p className="text-red-500 text-xs mt-1">{uploadError}</p>
                    )}
                  </div>
                </div>

              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={handleSaveProperty} className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg border-0 cursor-pointer hover:bg-[#d4af37] transition-colors">
                  Guardar cambios
                </button>
                <button onClick={() => handleDelete(form.id)} className="px-6 py-2.5 bg-red-50 text-red-500 text-sm font-semibold rounded-lg border-0 cursor-pointer hover:bg-red-100 transition-colors">
                  Eliminar propiedad
                </button>
                <button onClick={() => setEditing(null)} className="px-6 py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-lg border-0 cursor-pointer hover:bg-gray-200 transition-colors">
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-300">
              <p className="text-sm">Seleccioná una propiedad o creá una nueva</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}