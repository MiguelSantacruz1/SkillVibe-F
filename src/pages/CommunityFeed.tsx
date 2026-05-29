import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { postsApi } from '../services/api';
import type { CommunityPost, PostComment } from '../services/api';
import toast from 'react-hot-toast';
import {
  Heart,
  MessageCircle,
  Trash2,
  Send,
  Star,
  ChevronDown,
  Loader2,
  BookOpen,
} from 'lucide-react';

// ── helpers ────────────────────────────────────────────────────────────────────

const avatarUrl = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=a855f7&color=fff&bold=true`;

const roleLabel = (role: string) =>
  role?.replace('ROLE_', '') || 'USUARIO';

const roleBadgeColor = (role: string) => {
  if (role?.includes('TUTOR')) return { bg: 'rgba(168,85,247,0.15)', color: '#c084fc' };
  if (role?.includes('ADMIN')) return { bg: 'rgba(239,68,68,0.15)', color: '#f87171' };
  return { bg: 'rgba(99,102,241,0.15)', color: '#a5b4fc' };
};

const timeAgo = (dateStr: string) => {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return 'Hace un momento';
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
  return `Hace ${Math.floor(diff / 86400)} días`;
};

// ── sub-components ─────────────────────────────────────────────────────────────

interface CommentBlockProps {
  comment: PostComment;
}
const CommentBlock: React.FC<CommentBlockProps> = ({ comment }) => {
  const badge = roleBadgeColor(comment.authorRole);
  return (
    <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.75rem' }}>
      <img
        src={avatarUrl(comment.authorName)}
        alt={comment.authorName}
        style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, border: '2px solid rgba(168,85,247,0.3)' }}
      />
      <div style={{ flex: 1, background: 'rgba(15,23,42,0.5)', borderRadius: 10, padding: '0.6rem 0.9rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{comment.authorName}</span>
          <span style={{
            fontSize: '0.7rem', fontWeight: 600, padding: '0.1rem 0.5rem',
            borderRadius: 50, background: badge.bg, color: badge.color
          }}>
            {roleLabel(comment.authorRole)}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            {timeAgo(comment.createdAt)}
          </span>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-color)', margin: 0 }}>{comment.content}</p>
      </div>
    </div>
  );
};

interface PostCardProps {
  post: CommunityPost;
  currentUserId: number;
  isAdmin: boolean;
  onLike: (id: number) => void;
  onDelete: (id: number) => void;
  onComment: (id: number, text: string) => Promise<void>;
  onToggleFeatured: (id: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post, currentUserId, isAdmin, onLike, onDelete, onComment, onToggleFeatured
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const badge = roleBadgeColor(post.authorRole);

  const handleComment = async () => {
    if (!commentText.trim()) return;
    setSubmitting(true);
    await onComment(post.id, commentText);
    setCommentText('');
    setSubmitting(false);
  };

  return (
    <div className="glass-card" style={{
      padding: '1.5rem',
      border: post.featured ? '1px solid rgba(168,85,247,0.5)' : '1px solid var(--glass-border)',
      transition: 'none',
      marginBottom: 0,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <img
          src={avatarUrl(post.authorName)}
          alt={post.authorName}
          style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid rgba(168,85,247,0.4)', flexShrink: 0 }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700 }}>{post.authorName}</span>
            <span style={{
              fontSize: '0.72rem', fontWeight: 600, padding: '0.1rem 0.6rem',
              borderRadius: 50, background: badge.bg, color: badge.color
            }}>
              {roleLabel(post.authorRole)}
            </span>
            {post.featured && (
              <span style={{
                fontSize: '0.72rem', fontWeight: 700, padding: '0.1rem 0.6rem',
                borderRadius: 50, background: 'rgba(245,158,11,0.15)', color: '#fbbf24',
                display: 'flex', alignItems: 'center', gap: '0.2rem'
              }}>
                <Star size={10} /> Destacado
              </span>
            )}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{timeAgo(post.createdAt)}</span>
        </div>
        {/* Actions top-right */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {isAdmin && (
            <button
              onClick={() => onToggleFeatured(post.id)}
              title={post.featured ? 'Quitar destacado' : 'Destacar'}
              style={{
                background: post.featured ? 'rgba(245,158,11,0.15)' : 'transparent',
                border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8,
                color: '#fbbf24', cursor: 'pointer', padding: '0.3rem 0.5rem',
                display: 'flex', alignItems: 'center', transition: 'all 0.2s'
              }}>
              <Star size={15} />
            </button>
          )}
          {(isAdmin || post.authorId === currentUserId) && (
            <button
              onClick={() => onDelete(post.id)}
              title="Eliminar"
              style={{
                background: 'transparent', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 8, color: '#f87171', cursor: 'pointer',
                padding: '0.3rem 0.5rem', display: 'flex', alignItems: 'center',
                transition: 'all 0.2s'
              }}>
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <p style={{ lineHeight: 1.7, marginBottom: post.imageUrl ? '1rem' : '1.25rem', whiteSpace: 'pre-wrap' }}>
        {post.content}
      </p>

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Imagen de la publicación"
          style={{ width: '100%', borderRadius: 10, marginBottom: '1.25rem', maxHeight: 360, objectFit: 'cover' }}
        />
      )}

      {/* Action bar */}
      <div style={{
        display: 'flex', gap: '0.5rem', paddingTop: '0.75rem',
        borderTop: '1px solid var(--border-color)'
      }}>
        <button
          onClick={() => onLike(post.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            background: 'transparent', border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: 8, color: '#f87171', cursor: 'pointer',
            padding: '0.35rem 0.9rem', fontSize: '0.85rem', fontWeight: 600,
            transition: 'all 0.2s'
          }}>
          <Heart size={15} /> {post.likesCount}
        </button>

        <button
          onClick={() => setShowComments(p => !p)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            background: 'transparent', border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: 8, color: '#a5b4fc', cursor: 'pointer',
            padding: '0.35rem 0.9rem', fontSize: '0.85rem', fontWeight: 600,
            transition: 'all 0.2s'
          }}>
          <MessageCircle size={15} /> {post.comments.length}
          <ChevronDown size={12} style={{ transform: showComments ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div style={{ marginTop: '1rem' }}>
          {post.comments.map(c => <CommentBlock key={c.id} comment={c} />)}

          {/* New comment input */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
            <input
              className="form-input"
              placeholder="Escribe un comentario..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleComment(); } }}
              style={{ flex: 1, padding: '0.5rem 0.9rem' }}
            />
            <button
              onClick={handleComment}
              disabled={submitting || !commentText.trim()}
              style={{
                background: 'linear-gradient(135deg,#6366f1,#a855f7)',
                border: 'none', borderRadius: 8, color: '#fff',
                padding: '0.5rem 0.9rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', transition: 'opacity 0.2s',
                opacity: (submitting || !commentText.trim()) ? 0.5 : 1
              }}>
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Page ──────────────────────────────────────────────────────────────────

const CommunityFeed: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [featured, setFeatured] = useState<CommunityPost[]>([]);
  const [newContent, setNewContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN';

  const loadFeed = useCallback(async (pageNum: number, append = false) => {
    try {
      const res = await postsApi.getFeed(pageNum, 10);
      const data = res.data as any;
      const content: CommunityPost[] = data?.content ?? data ?? [];
      const totalPages: number = data?.totalPages ?? 1;
      setPosts(prev => append ? [...prev, ...content] : content);
      setHasMore(pageNum + 1 < totalPages);
    } catch {
      toast.error('No se pudo cargar el feed.');
    }
  }, []);

  const loadFeatured = useCallback(async () => {
    try {
      const res = await postsApi.getFeatured();
      setFeatured((res.data as any) ?? []);
    } catch { /* silencioso */ }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([loadFeed(0), loadFeatured()]).finally(() => setLoading(false));
  }, [loadFeed, loadFeatured]);

  const handlePost = async () => {
    if (!newContent.trim()) return;
    setPosting(true);
    try {
      const res = await postsApi.create({ content: newContent, imageUrl: imageUrl || undefined });
      const created = res.data as unknown as CommunityPost;
      setPosts(prev => [created, ...prev]);
      setNewContent('');
      setImageUrl('');
      toast.success('¡Publicación creada!');
    } catch {
      toast.error('No se pudo crear la publicación.');
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      const res = await postsApi.like(postId);
      const updated = res.data as unknown as CommunityPost;
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likesCount: updated.likesCount } : p));
    } catch { /* silencioso */ }
  };

  const handleDelete = async (postId: number) => {
    if (!confirm('¿Seguro que deseas eliminar esta publicación?')) return;
    try {
      await postsApi.delete(postId);
      setPosts(prev => prev.filter(p => p.id !== postId));
      setFeatured(prev => prev.filter(p => p.id !== postId));
      toast.success('Publicación eliminada.');
    } catch {
      toast.error('No se pudo eliminar.');
    }
  };

  const handleComment = async (postId: number, text: string) => {
    try {
      const res = await postsApi.addComment(postId, { content: text });
      const comment = res.data as unknown as PostComment;
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, comments: [...p.comments, comment] } : p
      ));
    } catch {
      toast.error('No se pudo agregar el comentario.');
    }
  };

  const handleToggleFeatured = async (postId: number) => {
    try {
      const res = await postsApi.toggleFeatured(postId);
      const updated = res.data as unknown as CommunityPost;
      setPosts(prev => prev.map(p => p.id === postId ? updated : p));
      await loadFeatured();
      toast.success(updated.featured ? 'Publicación destacada.' : 'Quitado de destacados.');
    } catch {
      toast.error('Error al cambiar estado destacado.');
    }
  };

  const handleLoadMore = async () => {
    const next = page + 1;
    setLoadingMore(true);
    await loadFeed(next, true);
    setPage(next);
    setLoadingMore(false);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem 1rem' }}>
      <div className="community-layout">

        {/* ── Left: Profile ─────────────────────────────────────────────── */}
        <aside>
          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', border: '1px solid rgba(168,85,247,0.2)', position: 'sticky', top: 90 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%', margin: '0 auto 1rem',
              border: '3px solid rgba(168,85,247,0.5)',
              overflow: 'hidden', boxShadow: '0 0 20px rgba(168,85,247,0.3)'
            }}>
              <img src={avatarUrl(user?.fullName || 'U')} alt={user?.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>{user?.fullName}</h3>
            <span style={{
              display: 'inline-block', fontSize: '0.75rem', fontWeight: 700,
              padding: '0.2rem 0.8rem', borderRadius: 50, marginBottom: '1rem',
              ...roleBadgeColor(user?.role || '')
            }}>
              {roleLabel(user?.role || '')}
            </span>
            <div style={{
              borderTop: '1px solid var(--border-color)', paddingTop: '1rem',
              display: 'flex', justifyContent: 'space-around'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#a855f7' }}>
                  {posts.filter(p => p.authorId === user?.id).length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Publicaciones</div>
              </div>
            </div>
            {user?.role === 'ROLE_STUDENT' && (
              <div style={{
                marginTop: '1rem', padding: '0.75rem', borderRadius: 10,
                background: 'rgba(168,85,247,0.07)', border: '1px solid rgba(168,85,247,0.15)',
                display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}>
                <BookOpen size={16} color="#a855f7" />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Saldo: <strong style={{ color: '#a855f7' }}>${user?.balance?.toLocaleString('es-CO')}</strong>
                </span>
              </div>
            )}
          </div>
        </aside>

        {/* ── Center: Feed ───────────────────────────────────────────────── */}
        <main>
          {/* Create post */}
          <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.25rem', border: '1px solid rgba(168,85,247,0.2)' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <img
                src={avatarUrl(user?.fullName || 'U')}
                alt={user?.fullName}
                style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid rgba(168,85,247,0.4)', flexShrink: 0 }}
              />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="¿Qué quieres compartir con la comunidad?"
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  style={{ resize: 'none', fontSize: '0.95rem' }}
                />
                <input
                  className="form-input"
                  type="url"
                  placeholder="URL de imagen (opcional)"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  style={{ fontSize: '0.875rem', padding: '0.5rem 0.9rem' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={handlePost}
                    disabled={posting || !newContent.trim()}
                    className="btn btn-primary"
                    style={{
                      padding: '0.5rem 1.5rem', fontSize: '0.9rem',
                      opacity: (posting || !newContent.trim()) ? 0.6 : 1,
                      display: 'flex', alignItems: 'center', gap: '0.4rem'
                    }}>
                    {posting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    Publicar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto' }} />
              <p style={{ marginTop: '1rem' }}>Cargando publicaciones...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <MessageCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
              <p>Sé el primero en publicar algo en la comunidad.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {posts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={user?.id ?? 0}
                  isAdmin={isAdmin}
                  onLike={handleLike}
                  onDelete={handleDelete}
                  onComment={handleComment}
                  onToggleFeatured={handleToggleFeatured}
                />
              ))}
              {hasMore && (
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  style={{
                    background: 'transparent', border: '1px solid var(--border-color)',
                    borderRadius: 10, color: 'var(--text-muted)', cursor: 'pointer',
                    padding: '0.75rem', fontSize: '0.9rem', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    transition: 'all 0.2s'
                  }}>
                  {loadingMore ? <Loader2 size={16} className="animate-spin" /> : 'Cargar más publicaciones'}
                </button>
              )}
            </div>
          )}
        </main>

        {/* ── Right: Featured ────────────────────────────────────────────── */}
        <aside>
          <div className="glass-card" style={{ padding: '1.25rem', border: '1px solid rgba(245,158,11,0.2)', position: 'sticky', top: 90 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Star size={18} color="#fbbf24" />
              <h3 style={{ fontSize: '0.95rem', margin: 0 }}>Destacados</h3>
            </div>
            {featured.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
                Aún no hay publicaciones destacadas.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {featured.map(p => (
                  <div key={p.id} style={{
                    padding: '0.75rem', borderRadius: 10,
                    background: 'rgba(245,158,11,0.05)',
                    border: '1px solid rgba(245,158,11,0.15)',
                    cursor: 'default'
                  }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <img
                        src={avatarUrl(p.authorName)}
                        alt={p.authorName}
                        style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid rgba(168,85,247,0.3)' }}
                      />
                      <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>{p.authorName}</span>
                    </div>
                    <p style={{
                      fontSize: '0.82rem', color: 'var(--text-muted)',
                      margin: 0, display: '-webkit-box', WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden'
                    }}>
                      {p.content}
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Heart size={11} /> {p.likesCount}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MessageCircle size={11} /> {p.comments.length}
                      </span>
                      <span style={{ marginLeft: 'auto' }}>{timeAgo(p.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

      </div>

      <style>{`
        .community-layout {
          display: grid;
          grid-template-columns: 240px 1fr 260px;
          gap: 1.5rem;
          align-items: start;
        }
        @media (max-width: 1100px) {
          .community-layout {
            grid-template-columns: 200px 1fr;
          }
          .community-layout > aside:last-child {
            display: none;
          }
        }
        @media (max-width: 720px) {
          .community-layout {
            grid-template-columns: 1fr;
          }
          .community-layout > aside:first-child {
            display: none;
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .glass-card {
          transition: none !important;
          transform: none !important;
        }
        .glass-card:hover {
          transform: none !important;
        }
      `}</style>
    </div>
  );
};

export default CommunityFeed;
