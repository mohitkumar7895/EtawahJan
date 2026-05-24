'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  createDefaultResumeDocument,
  type ResumeContent,
  type ResumeDocument,
  type ResumeSectionConfig,
  type ResumeThemeSettings,
} from '@/lib/resume-builder/types';
import { calculateCompletion, estimateAtsScore } from '@/lib/resume-builder/completion';
import { applyTemplatePreset } from '@/lib/resume-builder/template-presets';

interface ResumeEditorState {
  resumeId: string | null;
  document: ResumeDocument;
  activeSection: string;
  zoom: number;
  sidebarOpen: boolean;
  previewMode: 'desktop' | 'mobile';
  darkPreview: boolean;
  isDirty: boolean;
  lastSavedAt: string | null;
  historyPast: ResumeDocument[];
  historyFuture: ResumeDocument[];
  setResumeId: (id: string | null) => void;
  loadDocument: (doc: ResumeDocument, id?: string) => void;
  patchDocument: (patch: Partial<ResumeDocument>, options?: { saveHistory?: boolean }) => void;
  updateContent: (patch: Partial<ResumeContent>, options?: { saveHistory?: boolean }) => void;
  setSections: (sections: ResumeSectionConfig[]) => void;
  setActiveSection: (id: string) => void;
  setZoom: (z: number) => void;
  toggleSidebar: () => void;
  setPreviewMode: (mode: 'desktop' | 'mobile') => void;
  setDarkPreview: (v: boolean) => void;
  reorderSections: (sections: ResumeSectionConfig[]) => void;
  updateTheme: (theme: Partial<ResumeThemeSettings>, options?: { saveHistory?: boolean }) => void;
  setTemplate: (templateId: string) => void;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  markSaved: () => void;
  recalcScores: () => void;
}

function withScores(doc: ResumeDocument): ResumeDocument {
  return {
    ...doc,
    completionPercent: calculateCompletion(doc),
    atsScore: estimateAtsScore(doc),
  };
}

export const useResumeStore = create<ResumeEditorState>()(
  persist(
    (set, get) => ({
      resumeId: null,
      document: createDefaultResumeDocument(),
      activeSection: 'personal',
      zoom: 100,
      sidebarOpen: true,
      previewMode: 'desktop',
      darkPreview: false,
      isDirty: false,
      lastSavedAt: null,
      historyPast: [],
      historyFuture: [],

      setResumeId: (id) => set({ resumeId: id }),

      loadDocument: (doc, id) =>
        set({
          document: withScores(doc),
          resumeId: id ?? get().resumeId,
          isDirty: false,
          historyPast: [],
          historyFuture: [],
        }),

      patchDocument: (patch, options) => {
        if (options?.saveHistory) get().pushHistory();
        set((s) => ({
          document: withScores({ ...s.document, ...patch, version: s.document.version }),
          isDirty: true,
        }));
      },

      updateContent: (patch, options) => {
        if (options?.saveHistory) get().pushHistory();
        set((s) => ({
          document: withScores({
            ...s.document,
            content: { ...s.document.content, ...patch },
            version: s.document.version,
          }),
          isDirty: true,
        }));
      },

      setSections: (sections) => {
        set((s) => ({
          document: withScores({ ...s.document, sections }),
          isDirty: true,
        }));
      },

      setActiveSection: (id) => set({ activeSection: id }),
      setZoom: (z) => set({ zoom: Math.min(150, Math.max(50, z)) }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setPreviewMode: (mode) => set({ previewMode: mode }),
      setDarkPreview: (v) => set({ darkPreview: v }),

      reorderSections: (sections) => {
        get().pushHistory();
        set((s) => ({
          document: withScores({ ...s.document, sections }),
          isDirty: true,
        }));
      },

      updateTheme: (theme, options) => {
        if (options?.saveHistory) get().pushHistory();
        set((s) => ({
          document: withScores({
            ...s.document,
            theme: { ...s.document.theme, ...theme },
          }),
          isDirty: true,
        }));
      },

      setTemplate: (templateId) => {
        get().pushHistory();
        set((s) => ({
          document: withScores({
            ...s.document,
            templateId,
            theme: applyTemplatePreset(templateId, s.document.theme),
          }),
          darkPreview: templateId === 'dark' || templateId === 'developer',
          isDirty: true,
        }));
      },

      pushHistory: () => {
        const { document, historyPast } = get();
        const next = [...historyPast, JSON.parse(JSON.stringify(document))].slice(-20);
        set({ historyPast: next, historyFuture: [] });
      },

      undo: () => {
        const { historyPast, document, historyFuture } = get();
        if (!historyPast.length) return;
        const prev = historyPast[historyPast.length - 1];
        set({
          historyPast: historyPast.slice(0, -1),
          historyFuture: [document, ...historyFuture].slice(0, 20),
          document: withScores(prev),
          isDirty: true,
        });
      },

      redo: () => {
        const { historyFuture, document, historyPast } = get();
        if (!historyFuture.length) return;
        const next = historyFuture[0];
        set({
          historyFuture: historyFuture.slice(1),
          historyPast: [...historyPast, document].slice(-20),
          document: withScores(next),
          isDirty: true,
        });
      },

      markSaved: () =>
        set({ isDirty: false, lastSavedAt: new Date().toISOString() }),

      recalcScores: () =>
        set((s) => ({ document: withScores(s.document) })),
    }),
    {
      name: 'janseva-resume-draft',
      partialize: (s) => ({
        document: s.document,
        resumeId: s.resumeId,
        activeSection: s.activeSection,
        templateId: s.document.templateId,
      }),
    }
  )
);
