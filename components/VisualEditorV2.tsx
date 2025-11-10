"use client";

import React, { useState, useCallback, useMemo, useRef } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { GripVertical, Plus, Trash2, Eye, Settings, Save } from "lucide-react";

/**
 * VisualEditorV2 - Rebuilt from scratch with focus on:
 * 1. NO FOCUS LOSS on input fields
 * 2. Performance optimization with proper memoization
 * 3. Clean separation of concerns
 * 4. Simplified state management
 */

// Types
export interface PageComponent {
  id: string;
  type: string;
  data: Record<string, any>;
}

interface VisualEditorV2Props {
  initialComponents?: PageComponent[];
  onSave?: (components: PageComponent[]) => void;
  onChange?: (components: PageComponent[]) => void;
}

// Property editor that NEVER re-renders on parent updates
const PropertyEditor = React.memo(
  function PropertyEditor({
    component,
    onUpdate,
  }: {
    component: PageComponent;
    onUpdate: (data: Partial<PageComponent["data"]>) => void;
  }) {
    // Use local state for inputs to prevent parent re-renders
    const [localData, setLocalData] = useState(component.data);
    const updateTimeoutRef = useRef<NodeJS.Timeout>();

    // Sync local state only when component ID changes (different component selected)
    React.useEffect(() => {
      setLocalData(component.data);
    }, [component.id]);

    // Debounced update to parent
    const handleChange = useCallback(
      (key: string, value: any) => {
        const newData = { ...localData, [key]: value };
        setLocalData(newData); // Update local state immediately for UI

        // Debounce parent update
        if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
        updateTimeoutRef.current = setTimeout(() => {
          onUpdate({ [key]: value });
        }, 300);
      },
      [localData, onUpdate]
    );

    // Cleanup
    React.useEffect(() => {
      return () => {
        if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
      };
    }, []);

    // Render form based on component type
    switch (component.type) {
      case "text":
        return (
          <div className="space-y-4 p-4">
            <h3 className="font-semibold">Text Block</h3>
            <div>
              <label className="block text-sm mb-1">Content</label>
              <textarea
                value={localData.content || ""}
                onChange={(e) => handleChange("content", e.target.value)}
                className="w-full border rounded px-3 py-2"
                rows={4}
                placeholder="Enter text content..."
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Alignment</label>
              <select
                value={localData.alignment || "left"}
                onChange={(e) => handleChange("alignment", e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        );

      case "image":
        return (
          <div className="space-y-4 p-4">
            <h3 className="font-semibold">Image Block</h3>
            <div>
              <label className="block text-sm mb-1">Image URL</label>
              <input
                type="text"
                value={localData.url || ""}
                onChange={(e) => handleChange("url", e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Alt Text</label>
              <input
                type="text"
                value={localData.alt || ""}
                onChange={(e) => handleChange("alt", e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Image description"
              />
            </div>
          </div>
        );

      case "button":
        return (
          <div className="space-y-4 p-4">
            <h3 className="font-semibold">Button Block</h3>
            <div>
              <label className="block text-sm mb-1">Button Text</label>
              <input
                type="text"
                value={localData.text || ""}
                onChange={(e) => handleChange("text", e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Click me"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Link URL</label>
              <input
                type="text"
                value={localData.link || ""}
                onChange={(e) => handleChange("link", e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="/contact"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Style</label>
              <select
                value={localData.style || "primary"}
                onChange={(e) => handleChange("style", e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
              </select>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4">
            <p className="text-gray-500">Select a component to edit properties</p>
          </div>
        );
    }
  },
  // Custom comparison: only re-render if component ID changes
  (prev, next) => prev.component.id === next.component.id
);

// Component preview renderer
const ComponentPreview = React.memo(
  function ComponentPreview({ component }: { component: PageComponent }) {
    switch (component.type) {
      case "text":
        return (
          <div
            className={`p-4 ${
              component.data.alignment === "center"
                ? "text-center"
                : component.data.alignment === "right"
                ? "text-right"
                : "text-left"
            }`}
          >
            <p className="whitespace-pre-wrap">{component.data.content || "Text content"}</p>
          </div>
        );

      case "image":
        return (
          <div className="p-4">
            {component.data.url ? (
              <img
                src={component.data.url}
                alt={component.data.alt || ""}
                className="max-w-full h-auto"
              />
            ) : (
              <div className="border-2 border-dashed border-gray-300 p-8 text-center text-gray-500">
                No image URL provided
              </div>
            )}
          </div>
        );

      case "button":
        return (
          <div className="p-4">
            <button
              className={`px-6 py-2 rounded ${
                component.data.style === "primary"
                  ? "bg-blue-600 text-white"
                  : component.data.style === "secondary"
                  ? "bg-gray-600 text-white"
                  : "border-2 border-blue-600 text-blue-600"
              }`}
            >
              {component.data.text || "Button"}
            </button>
          </div>
        );

      default:
        return (
          <div className="p-4 text-gray-500">
            Unknown component type: {component.type}
          </div>
        );
    }
  },
  (prev, next) => {
    // Only re-render if component data actually changed
    return (
      prev.component.id === next.component.id &&
      JSON.stringify(prev.component.data) === JSON.stringify(next.component.data)
    );
  }
);

export default function VisualEditorV2({
  initialComponents = [],
  onSave,
  onChange,
}: VisualEditorV2Props) {
  // State
  const [components, setComponents] = useState<PageComponent[]>(initialComponents);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Memoized selected component with stable reference
  const selectedComponent = useMemo(() => {
    return components.find((c) => c.id === selectedId) || null;
  }, [selectedId, components]);

  // Stable ref to prevent unnecessary re-renders
  const selectedComponentRef = useRef<PageComponent | null>(null);
  if (selectedComponent && selectedComponent.id === selectedId) {
    selectedComponentRef.current = selectedComponent;
  }

  // Handlers
  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const items = Array.from(components);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      setComponents(items);
      onChange?.(items);
    },
    [components, onChange]
  );

  const handleAddComponent = useCallback(
    (type: string) => {
      const newComponent: PageComponent = {
        id: `comp-${Date.now()}`,
        type,
        data: {},
      };
      const updated = [...components, newComponent];
      setComponents(updated);
      setSelectedId(newComponent.id);
      onChange?.(updated);
    },
    [components, onChange]
  );

  const handleUpdateComponent = useCallback(
    (id: string, data: Partial<PageComponent["data"]>) => {
      const updated = components.map((c) =>
        c.id === id ? { ...c, data: { ...c.data, ...data } } : c
      );
      setComponents(updated);
      onChange?.(updated);
    },
    [components, onChange]
  );

  const handleDeleteComponent = useCallback(
    (id: string) => {
      const updated = components.filter((c) => c.id !== id);
      setComponents(updated);
      if (selectedId === id) setSelectedId(null);
      onChange?.(updated);
    },
    [components, selectedId, onChange]
  );

  const handleSave = useCallback(() => {
    onSave?.(components);
  }, [components, onSave]);

  return (
    <div className="flex h-full">
      {/* Left Sidebar - Component Library */}
      {!previewMode && (
        <div className="w-64 border-r bg-gray-50 p-4 overflow-y-auto">
          <h2 className="font-bold mb-4">Add Components</h2>
          <div className="space-y-2">
            <button
              onClick={() => handleAddComponent("text")}
              className="w-full text-left px-3 py-2 border rounded hover:bg-white"
            >
              📝 Text Block
            </button>
            <button
              onClick={() => handleAddComponent("image")}
              className="w-full text-left px-3 py-2 border rounded hover:bg-white"
            >
              🖼️ Image
            </button>
            <button
              onClick={() => handleAddComponent("button")}
              className="w-full text-left px-3 py-2 border rounded hover:bg-white"
            >
              🔘 Button
            </button>
          </div>
        </div>
      )}

      {/* Center - Canvas */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold" aria-level={2} role="heading">Page Editor V2</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="px-4 py-2 border rounded hover:bg-gray-50 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {previewMode ? "Edit" : "Preview"}
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto p-8">
          {components.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center text-gray-500">
              <p>No components yet. Add components from the sidebar to get started.</p>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="components">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {components.map((component, index) => (
                      <Draggable key={component.id} draggableId={component.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`border rounded-lg ${
                              selectedId === component.id
                                ? "ring-2 ring-blue-500"
                                : "hover:border-blue-300"
                            } ${snapshot.isDragging ? "shadow-lg" : ""}`}
                          >
                            {!previewMode && (
                              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b">
                                <div {...provided.dragHandleProps} className="cursor-move">
                                  <GripVertical className="w-4 h-4 text-gray-400" />
                                </div>
                                <span className="text-sm font-medium capitalize">{component.type}</span>
                                <div className="ml-auto flex gap-2">
                                  <button
                                    onClick={() => setSelectedId(component.id)}
                                    className="p-1 hover:bg-gray-200 rounded"
                                  >
                                    <Settings className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteComponent(component.id)}
                                    className="p-1 hover:bg-red-100 rounded text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                            <ComponentPreview component={component} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      {!previewMode && (
        <div className="w-80 border-l bg-gray-50 overflow-y-auto">
          <div className="sticky top-0 bg-gray-50 border-b p-4 z-10">
            <h2 className="font-bold">Properties</h2>
          </div>
          {selectedId && selectedComponentRef.current ? (
            <PropertyEditor
              key={selectedId}
              component={selectedComponentRef.current}
              onUpdate={(data) => handleUpdateComponent(selectedId, data)}
            />
          ) : (
            <div className="p-4 text-gray-500 text-sm">
              Select a component to edit its properties
            </div>
          )}
        </div>
      )}
    </div>
  );
}
