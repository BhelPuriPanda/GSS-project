import { useState } from 'react';
import axios from 'axios';
import { Upload, Loader2, X } from 'lucide-react';

const PYTHON_API_BASE_URL = import.meta.env.VITE_PYTHON_API_BASE_URL || 'http://localhost:8000';

const DemoComparison = () => {
  const [fileA, setFileA] = useState(null);
  const [fileB, setFileB] = useState(null);
  const [previewA, setPreviewA] = useState('');
  const [previewB, setPreviewB] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileA = (event) => {
    const file = event.target.files[0];
    setFileA(file);
    setPreviewA(file ? URL.createObjectURL(file) : '');
  };

  const handleFileB = (event) => {
    const file = event.target.files[0];
    setFileB(file);
    setPreviewB(file ? URL.createObjectURL(file) : '');
  };

  const handleCompare = async () => {
    if (!fileA || !fileB) {
      setError('Select both images before comparing.');
      return;
    }

    setError('');
    setResult(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('file1', fileA);
    formData.append('file2', fileB);

    try {
      const response = await axios.post(`${PYTHON_API_BASE_URL}/compare/two-images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data?.success) {
        setResult(response.data.comparison || null);
      } else {
        setError(response.data?.detail || 'Comparison failed: invalid response from server.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Comparison request failed. Check the backend connection and image formats.');
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setFileA(null);
    setFileB(null);
    setPreviewA('');
    setPreviewB('');
    setResult(null);
    setError('');
  };

  return (
    <div className="space-y-12 py-12">
      <div className="module-card p-8 border-white/[0.08] bg-black/30">
        <div className="mb-6 flex items-center gap-3 text-slate-300">
          <Upload size={20} />
          <h1 className="text-3xl font-black uppercase tracking-widest text-white">ML Sandbox: Image Compare</h1>
        </div>
        <p className="text-sm text-slate-400">Upload two images to compare their perceptual hash and embedding similarity with the Python ML engine.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <label className="module-card p-6 border border-white/[0.08] bg-black/40 flex flex-col gap-3">
          <span className="text-xs uppercase tracking-widest text-slate-500">Image A</span>
          <input type="file" accept="image/*" onChange={handleFileA} />
          {previewA && <img src={previewA} alt="Preview A" className="h-44 w-full object-contain border border-white/20" />}
        </label>

        <label className="module-card p-6 border border-white/[0.08] bg-black/40 flex flex-col gap-3">
          <span className="text-xs uppercase tracking-widest text-slate-500">Image B</span>
          <input type="file" accept="image/*" onChange={handleFileB} />
          {previewB && <img src={previewB} alt="Preview B" className="h-44 w-full object-contain border border-white/20" />}
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={handleCompare}
          disabled={loading || !fileA || !fileB}
          className="btn-cyber bg-red-600 hover:bg-red-500 text-white"
        >

          {loading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
          className="btn-cyber-outline hover:bg-white/[0.1] text-slate-300"
            <span>Compare</span>
          <X size={16} />
          <span>Reset</span>
        </button>
      </div>

      {error && (
        <div className="module-card p-4 border border-red-500/30 bg-red-600/10 text-red-200">{error}</div>
      )}

      {result && (
        <div className="module-card p-6 border border-white/[0.08] bg-black/40">
          <h2 className="text-lg font-black uppercase tracking-wider text-white">Comparison Result</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded border border-white/[0.1] p-4">
              <span className="font-bold uppercase text-slate-400 text-xs">Cosine Similarity</span>
              <p className="text-2xl font-black text-cyan-300">{result.cosine_similarity?.toFixed(4) ?? 'N/A'}</p>
            </div>
            <div className="rounded border border-white/[0.1] p-4">
              <span className="font-bold uppercase text-slate-400 text-xs">Hamming Distance</span>
              <p className="text-2xl font-black text-orange-300">{result.hamming_distance ?? 'N/A'}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-300">
            <p>Match Status: <strong>{result.match ? 'Likely duplicate' : 'Not a duplicate'}</strong></p>
            <p>
              Thresholds: cosine threshold {(result.thresholds && result.thresholds.cosine_threshold) || 'N/A'};
              {' '}hamming threshold {(result.thresholds && result.thresholds.hamming_threshold) || 'N/A'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoComparison;
