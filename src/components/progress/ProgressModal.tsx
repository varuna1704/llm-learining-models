import React from 'react';
import { BADGES, loadUserProgress, type UserProgressState } from '../../data/progress';

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const progress: UserProgressState = loadUserProgress();
  const totalBadges = BADGES.length;
  const unlockedCount = progress.unlockedBadgeIds.length;
  const masteryPercentage = Math.round((unlockedCount / totalBadges) * 100);

  return (
    <div className="compare-modal-backdrop" onClick={onClose} style={{ zIndex: 100 }}>
      <div
        className="compare-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '800px', width: '90%' }}
      >
        <div className="compare-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.8rem' }}>🏆</span>
            <div>
              <h3 className="compare-modal-title">Learning Progress & Achievements</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Track your streak, lab completions, and unlocked skill badges
              </p>
            </div>
          </div>
          <button className="panel-close-btn" onClick={onClose} style={{ fontSize: '1.5rem' }}>
            ×
          </button>
        </div>

        <div className="compare-modal-body" style={{ padding: '1.5rem' }}>
          {/* Top Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--bg-darker)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>🔥</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-accent)' }}>
                {progress.streakDays} Day{progress.streakDays === 1 ? '' : 's'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Streak</div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--bg-darker)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>🧪</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                {progress.completedLabs.length} / 14
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Labs Completed</div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--bg-darker)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>🎖️</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>
                {unlockedCount} / {totalBadges}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Badges Unlocked</div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--bg-darker)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>🎯</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>
                {masteryPercentage}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mastery Rate</div>
            </div>
          </div>

          {/* Badges Grid */}
          <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>
            Unlocked Badges & Achievements
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {BADGES.map((badge) => {
              const isUnlocked = progress.unlockedBadgeIds.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    backgroundColor: isUnlocked ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isUnlocked ? 'rgba(139, 92, 246, 0.3)' : 'var(--border-color)'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                    opacity: isUnlocked ? 1 : 0.5,
                    filter: isUnlocked ? 'none' : 'grayscale(80%)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{badge.icon}</span>
                    <strong style={{ color: isUnlocked ? '#fff' : 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {badge.title}
                    </strong>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                    {badge.description}
                  </p>
                  <div style={{ marginTop: 'auto', paddingTop: '0.4rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem' }}>
                    <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{badge.category}</span>
                    <span style={{ color: isUnlocked ? '#34d399' : 'var(--text-muted)', fontWeight: 700 }}>
                      {isUnlocked ? '✓ UNLOCKED' : '🔒 LOCKED'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
