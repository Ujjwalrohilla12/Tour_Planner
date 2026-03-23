"use client"
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import React, { ReactNode } from 'react'
import Provider from './provider';

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return (
      <div className="p-4 text-center text-sm text-red-700">
        <p className="font-semibold">Missing Convex configuration</p>
        <p>
          Set <code className="font-mono">NEXT_PUBLIC_CONVEX_URL</code> in <code className="font-mono">.env.local</code> and restart the dev server.
        </p>
        <p>
          If you&apos;re running <code className="font-mono">convex dev</code>, make sure it&apos;s running and the URL is available.
        </p>
      </div>
    );
  }

  let parsedUrl: URL | null = null;
  try {
    parsedUrl = new URL(convexUrl);
  } catch (err) {
    return (
      <div className="p-4 text-center text-sm text-red-700">
        <p className="font-semibold">Convex URL is not a valid absolute URL</p>
        <p>
          Ensure <code className="font-mono">NEXT_PUBLIC_CONVEX_URL</code> is a full URL like <code className="font-mono">https://your-deployment.convex.cloud</code> or the local URL shown by <code className="font-mono">convex dev</code>.
        </p>
        <p>
          Current value: <span className="font-mono">{convexUrl}</span>
        </p>
      </div>
    );
  }

  const convex = new ConvexReactClient(parsedUrl.toString());
  return (
    <ConvexProvider client={convex}>
      <Provider>{children}</Provider>
    </ConvexProvider>
  );
}
