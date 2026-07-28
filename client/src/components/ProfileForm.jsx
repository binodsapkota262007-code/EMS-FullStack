import { Loader2, User, Save } from 'lucide-react';
import { useState } from 'react';
import api from "../api/axios";

const ProfileForm = ({ initialData, onSuccess }) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        setError("")
        setMessage("")
        const formData = new FormData(e.currentTarget);
       try {
       await api.post("/profile", formData)
        setMessage("Profile updated successfully")
        onSuccess?.()
       } catch (err) {
        setError(err.response?.data?.error || err.message )
       } finally {
        setLoading(false)
       }
    };

    return (
        <form onSubmit={handleSubmit} className='card p-5 sm:p-6 mb-6'>
            <h2 className='text-base font-medium text-slate-900 mb-6 pb-4 border-b border-slate-100 flex items-center gap-2'>
                <User className="w-5 h-5 text-slate-400" /> Public Profile
            </h2>

            {error && (
                <div className='bg-rose-50 text-rose-700 p-4 rounded-xl text-sm border border-rose-200 mb-6 flex items-start gap-3'>
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    {error}
                </div>
            )}

            {message && (
                <div className='bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm border border-emerald-200 mb-6 flex items-start gap-3'>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    {message}
                </div>
            )}

            <div className='space-y-5'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                        <input 
                            disabled 
                            value={`${initialData?.firstName || ''} ${initialData?.lastName || ''}`} 
                            className='bg-slate-50 text-slate-400 cursor-not-allowed w-full p-2 border rounded-lg'
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                             <input disabled value={initialData.email} className='bg-slate-50 text-slate-400 cursor-not-allowed'/>
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Position</label>
                            <input disabled value={initialData.position} className='bg-slate-50 text-slate-400 cursor-not-allowed'/>
                    </div>
                </div>

<div>
  <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
  <textarea disabled={initialData.isDeleted} name="bio" defaultValue={initialData.bio || ""}
  placeholder='Write a brief bio...' className={`resize-none ${initialData.isDeleted ? "bg-slate-50 text-slate-400 cursor-not-allowed" : ""}`} />
  <p className='text-xs text-slate-400 mt-1.5'>This will be displayed on your profile.</p>
</div>

{initialData.isDeleted ? (
  <div className='pt-2'>
    <div className='p-4 bg-rose-50 border border-rose-200 rounded-xl text-center'>
      <p className='text-rose-600 font-medium tracking-tight'>Account Deactivated</p>
      <p className='text-sm text-rose-500 mt-0.5'>You can no longer update your profile.</p>
    </div>
  </div>
) : (
  <div className='flex justify-end pt-2'>
  <button
  type="submit"
  disabled={loading}
  className="
    group
    btn-primary
    flex items-center justify-center gap-2
    w-full sm:w-auto

    transition-all duration-300 ease-in-out
    hover:scale-105
    hover:-translate-y-0.5
    active:scale-95

    shadow-lg shadow-indigo-500/25
    hover:shadow-xl hover:shadow-indigo-500/40

    disabled:opacity-60
    disabled:cursor-not-allowed
    disabled:hover:scale-100
    disabled:hover:translate-y-0
  "
>
  {loading ? (
    <Loader2 className="w-4 h-4 animate-spin" />
  ) : (
    <Save className="w-4 h-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
  )}

  <span className={loading ? "animate-pulse" : ""}>
    {loading ? "Saving..." : "Save Changes"}
  </span>
</button>
</div>

)}


            </div>
        </form>
    )
}

export default ProfileForm