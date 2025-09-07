'use client';

import dynamic from 'next/dynamic';

const ObsidianEditor = dynamic(() => import('@/components/ObsidianEditor'), {
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-slate-900">
      <div className="text-white text-xl">Loading Obsidian Editor...</div>
    </div>
  ),
});

export default function Home() {
  return <ObsidianEditor />;
}