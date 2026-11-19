import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, badge, colorClass = 'blue' }) {
  return (
    <div className={`stat-card card-${colorClass}`}>
      <div className="stat-card-header">
        <span className="stat-title">{title}</span>
        {Icon && (
          <div className="stat-icon-wrapper">
            <Icon size={22} />
          </div>
        )}
      </div>
      <div className="stat-main">
        <div className="stat-value">{value}</div>
        {badge && <span className={`stat-badge ${badge.type}`}>{badge.text}</span>}
      </div>
      {subtitle && <p className="stat-subtitle">{subtitle}</p>}
    </div>
  );
}

