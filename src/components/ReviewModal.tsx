import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { reviewApi } from '../services/api';
import toast from 'react-hot-toast';

interface ReviewModalProps {
  tutoringClassId: number;
  tutorName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ tutoringClassId, tutorName, isOpen, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Por favor selecciona una calificación');
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewApi.create({ tutoringClassId, rating, comment });
      toast.success('¡Reseña enviada con éxito!');
      onSuccess();
      onClose();
    } catch {
      toast.error('Error al enviar la reseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            Calificar a {tutorName}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-center">
              ¿Cómo calificarías tu clase?
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 dark:text-slate-600'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="comment" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Comentario (Opcional)
            </label>
            <textarea
              id="comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow resize-none"
              placeholder="¿Qué te pareció la clase?..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Reseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
