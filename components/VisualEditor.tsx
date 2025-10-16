'use client'

import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { 
  GripVertical, Plus, Trash2, Eye, Code, Monitor, Tablet, Smartphone,
  Type, Image as ImageIcon, Square, Columns, Layout, Save
} from 'lucide-react'
import Image from 'next/image'
import ImageUploader from './ImageUploader'

// Component types
type ComponentType = 'hero' | 'text' | 'image' | 'button' | 'columns' | 'spacer'

interface BaseComponent {
  id: string
  type: ComponentType
}

interface HeroComponent extends BaseComponent {
  type: 'hero'
  data: {
    title: string
    subtitle: string
    backgroundImage: string
    buttonText: string
    buttonLink: string
    alignment: 'left' | 'center' | 'right'
    overlay: number
  }
}

interface TextComponent extends BaseComponent {
  type: 'text'
  data: {
    content: string
    alignment: 'left' | 'center' | 'right'
    size: 'sm' | 'md' | 'lg' | 'xl'
  }
}

interface ImageComponent extends BaseComponent {
  type: 'image'
  data: {
    url: string
    alt: string
    caption?: string
    width: 'full' | 'large' | 'medium' | 'small'
  }
}

interface ButtonComponent extends BaseComponent {
  type: 'button'
  data: {
    text: string
    link: string
    style: 'primary' | 'secondary' | 'outline'
    alignment: 'left' | 'center' | 'right'
  }
}

interface ColumnsComponent extends BaseComponent {
  type: 'columns'
  data: {
    columns: Array<{
      content: string
      image?: string
    }>
  }
}

interface SpacerComponent extends BaseComponent {
  type: 'spacer'
  data: {
    height: 'sm' | 'md' | 'lg' | 'xl'
  }
}

type PageComponent = HeroComponent | TextComponent | ImageComponent | ButtonComponent | ColumnsComponent | SpacerComponent

interface VisualEditorProps {
  initialComponents?: PageComponent[]
  onSave: (components: PageComponent[]) => void
}

export default function VisualEditor({ initialComponents = [], onSave }: VisualEditorProps) {
  const [components, setComponents] = useState<PageComponent[]>(initialComponents)
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [previewMode, setPreviewMode] = useState(false)

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(components)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setComponents(items)
  }

  const addComponent = (type: ComponentType) => {
    const newComponent: PageComponent = {
      id: `component-${Date.now()}`,
      type,
      data: getDefaultData(type)
    } as PageComponent

    setComponents([...components, newComponent])
    setSelectedComponent(newComponent.id)
  }

  const getDefaultData = (type: ComponentType): any => {
    switch (type) {
      case 'hero':
        return {
          title: 'Welcome to Our Site',
          subtitle: 'This is a hero section',
          backgroundImage: '',
          buttonText: 'Learn More',
          buttonLink: '#',
          alignment: 'center',
          overlay: 50
        }
      case 'text':
        return {
          content: 'Enter your text here...',
          alignment: 'left',
          size: 'md'
        }
      case 'image':
        return {
          url: '',
          alt: 'Image',
          caption: '',
          width: 'full'
        }
      case 'button':
        return {
          text: 'Click Here',
          link: '#',
          style: 'primary',
          alignment: 'center'
        }
      case 'columns':
        return {
          columns: [
            { content: 'Column 1 content' },
            { content: 'Column 2 content' }
          ]
        }
      case 'spacer':
        return { height: 'md' }
      default:
        return {}
    }
  }

  const updateComponent = (id: string, data: any) => {
    setComponents(components.map(c => 
      c.id === id ? { ...c, data: { ...c.data, ...data } } : c
    ))
  }

  const deleteComponent = (id: string) => {
    setComponents(components.filter(c => c.id !== id))
    if (selectedComponent === id) setSelectedComponent(null)
  }

  const getViewportWidth = () => {
    switch (viewMode) {
      case 'mobile': return 'max-w-sm'
      case 'tablet': return 'max-w-2xl'
      default: return 'max-w-7xl'
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Component Library */}
      {!previewMode && (
        <div className="w-64 bg-white border-r overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="font-bold text-lg">Components</h2>
          </div>
          
          <div className="p-4 space-y-2">
            <button
              onClick={() => addComponent('hero')}
              className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <Layout className="h-5 w-5" />
              <span>Hero Section</span>
            </button>
            
            <button
              onClick={() => addComponent('text')}
              className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <Type className="h-5 w-5" />
              <span>Text Block</span>
            </button>
            
            <button
              onClick={() => addComponent('image')}
              className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <ImageIcon className="h-5 w-5" />
              <span>Image</span>
            </button>
            
            <button
              onClick={() => addComponent('button')}
              className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <Square className="h-5 w-5" />
              <span>Button</span>
            </button>
            
            <button
              onClick={() => addComponent('columns')}
              className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <Columns className="h-5 w-5" />
              <span>Columns</span>
            </button>
            
            <button
              onClick={() => addComponent('spacer')}
              className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <span className="h-5 w-5 flex items-center justify-center">⬍</span>
              <span>Spacer</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Toolbar */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-2 rounded ${viewMode === 'desktop' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'}`}
              title="Desktop view"
            >
              <Monitor className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('tablet')}
              className={`p-2 rounded ${viewMode === 'tablet' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'}`}
              title="Tablet view"
            >
              <Tablet className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`p-2 rounded ${viewMode === 'mobile' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'}`}
              title="Mobile view"
            >
              <Smartphone className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-4 py-2 rounded flex items-center gap-2 ${previewMode ? 'bg-primary-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {previewMode ? <Code className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {previewMode ? 'Edit' : 'Preview'}
            </button>
            
            <button
              onClick={() => onSave(components)}
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Page
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
          <div className={`mx-auto bg-white shadow-lg transition-all ${getViewportWidth()}`}>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="page-builder">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[600px]"
                  >
                    {components.length === 0 && (
                      <div className="flex items-center justify-center h-96 text-gray-400">
                        <div className="text-center">
                          <Plus className="h-12 w-12 mx-auto mb-2" />
                          <p>Drag components here to start building</p>
                        </div>
                      </div>
                    )}
                    
                    {components.map((component, index) => (
                      <Draggable
                        key={component.id}
                        draggableId={component.id}
                        index={index}
                        isDragDisabled={previewMode}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`relative group ${
                              selectedComponent === component.id ? 'ring-2 ring-primary-500' : ''
                            } ${snapshot.isDragging ? 'opacity-50' : ''}`}
                            onClick={() => !previewMode && setSelectedComponent(component.id)}
                          >
                            {!previewMode && (
                              <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div
                                  {...provided.dragHandleProps}
                                  className="p-1 bg-white rounded shadow cursor-move hover:bg-gray-50"
                                  title="Drag to reorder"
                                  aria-label="Drag to reorder"
                                >
                                  <GripVertical className="h-4 w-4" />
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteComponent(component.id)
                                  }}
                                  className="p-1 bg-white rounded shadow hover:bg-red-50 text-red-600"
                                  title="Delete component"
                                  aria-label="Delete component"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                            
                            <ComponentRenderer component={component} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      {!previewMode && selectedComponent && (
        <div className="w-80 bg-white border-l overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="font-bold text-lg">Properties</h2>
          </div>
          
          <div className="p-4">
            <ComponentProperties
              component={components.find(c => c.id === selectedComponent)!}
              onUpdate={(data) => updateComponent(selectedComponent, data)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Component Renderer
function ComponentRenderer({ component }: { component: PageComponent }) {
  switch (component.type) {
    case 'hero':
      return <HeroRenderer data={component.data} />
    case 'text':
      return <TextRenderer data={component.data} />
    case 'image':
      return <ImageRenderer data={component.data} />
    case 'button':
      return <ButtonRenderer data={component.data} />
    case 'columns':
      return <ColumnsRenderer data={component.data} />
    case 'spacer':
      return <SpacerRenderer data={component.data} />
    default:
      return null
  }
}

// Individual Component Renderers
function HeroRenderer({ data }: { data: HeroComponent['data'] }) {
  return (
    <div className="relative h-96 flex items-center justify-center text-white overflow-hidden">
      {data.backgroundImage && (
        <Image src={data.backgroundImage} alt="" fill className="object-cover" />
      )}
      <div 
        className="absolute inset-0 bg-black ve-hero-overlay"
        style={{ '--overlay': data.overlay } as React.CSSProperties}
      />
      <div className={`relative z-10 text-${data.alignment} max-w-4xl px-8`}>
        <h1 className="text-5xl font-bold mb-4">{data.title}</h1>
        <p className="text-xl mb-6">{data.subtitle}</p>
        {data.buttonText && (
          <a href={data.buttonLink} className="inline-block px-6 py-3 bg-primary-600 rounded-lg hover:bg-primary-700">
            {data.buttonText}
          </a>
        )}
      </div>
    </div>
  )
}

function TextRenderer({ data }: { data: TextComponent['data'] }) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-2xl'
  }
  
  return (
    <div className={`p-8 text-${data.alignment} ${sizeClasses[data.size]}`}>
      <div dangerouslySetInnerHTML={{ __html: data.content }} />
    </div>
  )
}

function ImageRenderer({ data }: { data: ImageComponent['data'] }) {
  const widthClasses = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    full: 'w-full'
  }
  
  return (
    <div className="p-8">
      <div className={`mx-auto ${widthClasses[data.width]}`}>
        {data.url && (
          <div className="relative aspect-video">
            <Image src={data.url} alt={data.alt} fill className="object-cover rounded-lg" />
          </div>
        )}
        {data.caption && (
          <p className="text-sm text-gray-600 mt-2 text-center">{data.caption}</p>
        )}
      </div>
    </div>
  )
}

function ButtonRenderer({ data }: { data: ButtonComponent['data'] }) {
  const styleClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
  }
  
  return (
    <div className={`p-8 text-${data.alignment}`}>
      <a
        href={data.link}
        className={`inline-block px-6 py-3 rounded-lg transition ${styleClasses[data.style]}`}
      >
        {data.text}
      </a>
    </div>
  )
}

function ColumnsRenderer({ data }: { data: ColumnsComponent['data'] }) {
  return (
    <div className="p-8">
      <div className={`grid grid-cols-${data.columns.length} gap-6`}>
        {data.columns.map((col, i) => (
          <div key={i} className="space-y-4">
            {col.image && (
              <div className="relative aspect-video">
                <Image src={col.image} alt="" fill className="object-cover rounded-lg" />
              </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: col.content }} />
          </div>
        ))}
      </div>
    </div>
  )
}

function SpacerRenderer({ data }: { data: SpacerComponent['data'] }) {
  const heights = {
    sm: 'h-8',
    md: 'h-16',
    lg: 'h-24',
    xl: 'h-32'
  }
  
  return <div className={heights[data.height]} />
}

// Component Properties Editor
function ComponentProperties({ component, onUpdate }: { component: PageComponent; onUpdate: (data: any) => void }) {
  switch (component.type) {
    case 'hero':
      return <HeroProperties data={component.data} onUpdate={onUpdate} />
    case 'text':
      return <TextProperties data={component.data} onUpdate={onUpdate} />
    case 'image':
      return <ImageProperties data={component.data} onUpdate={onUpdate} />
    case 'button':
      return <ButtonProperties data={component.data} onUpdate={onUpdate} />
    case 'columns':
      return <ColumnsProperties data={component.data} onUpdate={onUpdate} />
    case 'spacer':
      return <SpacerProperties data={component.data} onUpdate={onUpdate} />
    default:
      return null
  }
}

// Add missing TextProperties component
function TextProperties({ data, onUpdate }: { data: TextComponent['data']; onUpdate: (data: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Content</label>
        <textarea
          value={data.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          className="w-full border rounded px-3 py-2"
          rows={5}
          title="Text content"
          placeholder="Enter text content"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Alignment</label>
        <select
          value={data.alignment}
          onChange={(e) => onUpdate({ alignment: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Text alignment"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Size</label>
        <select
          value={data.size}
          onChange={(e) => onUpdate({ size: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Text size"
        >
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
          <option value="xl">Extra Large</option>
        </select>
      </div>
    </div>
  )
}

// Add missing ImageProperties component
function ImageProperties({ data, onUpdate }: { data: ImageComponent['data']; onUpdate: (data: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Image URL</label>
        <input
          type="text"
          value={data.url}
          onChange={(e) => onUpdate({ url: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Image URL"
          placeholder="Enter image URL"
          aria-label="Image URL"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Alt Text</label>
        <input
          type="text"
          value={data.alt}
          onChange={(e) => onUpdate({ alt: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Alt text"
          placeholder="Enter alt text"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Caption</label>
        <input
          type="text"
          value={data.caption}
          onChange={(e) => onUpdate({ caption: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Image caption"
          placeholder="Enter caption"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Width</label>
        <select
          value={data.width}
          onChange={(e) => onUpdate({ width: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Image width"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
          <option value="full">Full Width</option>
        </select>
      </div>
    </div>
  )
}

function HeroProperties({ data, onUpdate }: { data: HeroComponent['data']; onUpdate: (data: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Hero title"
          placeholder="Enter hero title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subtitle</label>
        <textarea
          value={data.subtitle}
          onChange={(e) => onUpdate({ subtitle: e.target.value })}
          className="w-full border rounded px-3 py-2"
          rows={3}
          title="Hero subtitle"
          placeholder="Enter hero subtitle"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Background Image</label>
        <ImageUploader onImageUrl={(url) => onUpdate({ backgroundImage: url })} />
        {data.backgroundImage && (
          <div className="mt-2 relative aspect-video">
            <Image src={data.backgroundImage} alt="" fill className="object-cover rounded" />
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Overlay Darkness (%)</label>
        <input
          type="range"
          min="0"
          max="100"
          value={data.overlay}
          onChange={(e) => onUpdate({ overlay: parseInt(e.target.value) })}
          className="w-full"
          title="Overlay darkness percentage"
          aria-label="Overlay darkness percentage"
        />
        <span className="text-sm text-gray-600">{data.overlay}%</span>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Button Text</label>
        <input
          type="text"
          value={data.buttonText}
          onChange={(e) => onUpdate({ buttonText: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Button text"
          placeholder="Enter button text"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Button Link</label>
        <input
          type="text"
          value={data.buttonLink}
          onChange={(e) => onUpdate({ buttonLink: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Button link"
          placeholder="Enter button link"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Alignment</label>
        <select
          value={data.alignment}
          onChange={(e) => onUpdate({ alignment: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Hero alignment"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
    </div>
  )
}

function ButtonProperties({ data, onUpdate }: { data: ButtonComponent['data']; onUpdate: (data: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Button Text</label>
        <input
          type="text"
          value={data.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Button text"
          placeholder="Enter button text"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Link</label>
        <input
          type="text"
          value={data.link}
          onChange={(e) => onUpdate({ link: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Button link"
          placeholder="Enter button link"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Style</label>
        <select
          value={data.style}
          onChange={(e) => onUpdate({ style: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Button style"
        >
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="outline">Outline</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Alignment</label>
        <select
          value={data.alignment}
          onChange={(e) => onUpdate({ alignment: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Button alignment"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
    </div>
  )
}

function ColumnsProperties({ data, onUpdate }: { data: ColumnsComponent['data']; onUpdate: (data: any) => void }) {
  return (
    <div className="space-y-4">
      {data.columns.map((col, i) => (
        <div key={i} className="border rounded p-3 space-y-2">
          <h4 className="font-medium">Column {i + 1}</h4>
          <textarea
            value={col.content}
            onChange={(e) => {
              const newColumns = [...data.columns]
              newColumns[i].content = e.target.value
              onUpdate({ columns: newColumns })
            }}
            className="w-full border rounded px-2 py-1 text-sm"
            rows={3}
            title={`Column ${i + 1} content`}
            placeholder={`Enter content for column ${i + 1}`}
          />
        </div>
      ))}
    </div>
  )
}

function SpacerProperties({ data, onUpdate }: { data: SpacerComponent['data']; onUpdate: (data: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="spacer-height" className="block text-sm font-medium mb-1">Height</label>
        <select
          id="spacer-height"
          value={data.height}
          onChange={(e) => onUpdate({ height: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="sm">Small (2rem)</option>
          <option value="md">Medium (4rem)</option>
          <option value="lg">Large (6rem)</option>
          <option value="xl">Extra Large (8rem)</option>
        </select>
      </div>
    </div>
  )
}
