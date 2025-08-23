// Component Library Integration Component
// Bridge between existing template system and new component library

"use client";

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useComponentLibrary } from '@/hooks/use-component-library';
import { useDesignConfig } from '@/hooks/use-design-config';
import { useLivePreview } from '@/hooks/use-live-preview';
import { ComponentBrowser } from './ComponentBrowser';
import { Template } from '@/data/templates';
import { ComponentDefinition } from '@/types/component-library';
import { TemplateBrowser } from '../templates/TemplateBrowser';
import {
  Palette,
  FileText,
  Zap,
  Settings,
  ChevronRight,
  Star,
  Download,
  Eye,
  Code,
  Layers,
  Grid,
  List
} from 'lucide-react';

interface ComponentLibraryIntegrationProps {
  onComponentInsert?: (componentId: string, variant?: string) => void;
  onTemplateInsert?: (templateId: string) => void;
  className?: string;
}

export function ComponentLibraryIntegration({
  onComponentInsert,
  onTemplateInsert,
  className = ''
}: ComponentLibraryIntegrationProps) {
  const { state: componentState, actions: componentActions } = useComponentLibrary();
  const { config: designConfig } = useDesignConfig();
  const { actions: livePreviewActions } = useLivePreview();

  const [activeTab, setActiveTab] = useState<'components' | 'templates'>('components');
  const [showComponentBrowser, setShowComponentBrowser] = useState(false);
  const [showTemplateBrowser, setShowTemplateBrowser] = useState(false);
  const [recentItems, setRecentItems] = useState<Array<{ type: 'component' | 'template'; id: string; name: string; timestamp: number }>>([]);

  // Load recent items from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('component-library-recent-items');
    if (saved) {
      try {
        setRecentItems(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load recent items:', error);
      }
    }
  }, []);

  // Save recent items to localStorage
  const addToRecentItems = (type: 'component' | 'template', id: string, name: string) => {
    const newItem = { type, id, name, timestamp: Date.now() };
    const updatedItems = [newItem, ...recentItems.filter(item => item.id !== id)].slice(0, 10);
    setRecentItems(updatedItems);
    localStorage.setItem('component-library-recent-items', JSON.stringify(updatedItems));
  };

  // Handle component selection
  const handleComponentSelect = (component: ComponentDefinition) => {
    addToRecentItems('component', component.metadata.id, component.metadata.name);
    onComponentInsert?.(component.metadata.id);
  };

  // Handle template selection
  const handleTemplateSelect = (template: Template) => {
    addToRecentItems('template', template.id, template.name);
    onTemplateInsert?.(template.id);
  };

  // Handle component insertion
  const handleComponentInsert = async (componentId: string, variant?: string) => {
    try {
      const component = componentActions.getComponentById(componentId);
      if (component) {
        addToRecentItems('component', componentId, component.metadata.name);

        // Generate and insert component code
        const generatedCode = componentActions.generateComponentCode(
          componentId,
          variant ? component.variants.find(v => v.id === variant)?.props || {} : {},
          variant
        );

        // Insert into live preview
        livePreviewActions.updateHTML(livePreviewActions.state.htmlContent + generatedCode.html);
        if (generatedCode.css) {
          livePreviewActions.updateCSS(livePreviewActions.state.cssContent + generatedCode.css);
        }
        if (generatedCode.js) {
          livePreviewActions.updateJS(livePreviewActions.state.jsContent + generatedCode.js);
        }
      }
    } catch (error) {
      console.error('Failed to insert component:', error);
    }
  };

  // Handle template insertion
  const handleTemplateInsert = (templateId: string) => {
    const templates = require('@/data/templates').templates;
    const template = templates.find((t: Template) => t.id === templateId);
    if (template) {
      addToRecentItems('template', templateId, template.name);

      // Insert template into live preview
      livePreviewActions.updateHTML(template.htmlCode);
      livePreviewActions.updateCSS('');
      livePreviewActions.updateJS('');
    }
  };

  // Quick stats
  const stats = {
    components: componentState.components.size,
    templates: require('@/data/templates').templates.length,
    favorites: componentState.favorites.size,
    recent: recentItems.length
  };

  return (
    <div className={`w-full h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Palette className="w-6 h-6" />
              Component Library
            </h2>
            <p className="text-muted-foreground">Build with components and templates</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowComponentBrowser(!showComponentBrowser)}
            >
              <Layers className="w-4 h-4 mr-2" />
              Browse Components
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTemplateBrowser(!showTemplateBrowser)}
            >
              <FileText className="w-4 h-4 mr-2" />
              Browse Templates
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Layers className="w-4 h-4" />
            {stats.components} components
          </span>
          <span className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            {stats.templates} templates
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            {stats.favorites} favorites
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-4 h-4" />
            {stats.recent} recent
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'components' | 'templates')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="components" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Components ({stats.components})
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Templates ({stats.templates})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="components" className="mt-4">
            {showComponentBrowser ? (
              <ComponentBrowser
                onComponentSelect={handleComponentSelect}
                onInsertComponent={handleComponentInsert}
                className="h-96"
              />
            ) : (
              <ComponentGrid
                components={Array.from(componentState.components.values())}
                onComponentSelect={handleComponentSelect}
                onInsertComponent={handleComponentInsert}
              />
            )}
          </TabsContent>

          <TabsContent value="templates" className="mt-4">
            {showTemplateBrowser ? (
              <TemplateBrowser
                onTemplateSelect={handleTemplateSelect}
                className="h-96"
              />
            ) : (
              <TemplateGrid
                templates={require('@/data/templates').templates}
                onTemplateSelect={handleTemplateSelect}
                onInsertTemplate={handleTemplateInsert}
              />
            )}
          </TabsContent>
        </Tabs>

        {/* Recent Items */}
        {recentItems.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4" />
              <h3 className="font-semibold">Recent Items</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {recentItems.slice(0, 4).map((item) => (
                <Button
                  key={`${item.type}-${item.id}`}
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    if (item.type === 'component') {
                      handleComponentInsert(item.id);
                    } else {
                      handleTemplateInsert(item.id);
                    }
                  }}
                >
                  {item.type === 'component' ? (
                    <Layers className="w-3 h-3 mr-2" />
                  ) : (
                    <FileText className="w-3 h-3 mr-2" />
                  )}
                  <span className="truncate">{item.name}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t p-4 bg-muted/50">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Design System: {designConfig.mode}</span>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Manage Library
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Import/Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component Grid Component
interface ComponentGridProps {
  components: ComponentLibraryItem[];
  onComponentSelect: (component: ComponentDefinition) => void;
  onInsertComponent: (componentId: string, variant?: string) => void;
}

function ComponentGrid({ components, onComponentSelect, onInsertComponent }: ComponentGridProps) {
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'recent'>('name');

  const sortedComponents = [...components].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.metadata.name.localeCompare(b.metadata.name);
      case 'category':
        return a.metadata.category.localeCompare(b.metadata.category);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Available Components</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="text-sm border rounded px-2 py-1"
        >
          <option value="name">Sort by Name</option>
          <option value="category">Sort by Category</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedComponents.slice(0, 6).map((component) => (
          <Card key={component.metadata.id} className="group cursor-pointer transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{component.metadata.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {component.metadata.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {component.metadata.description}
              </p>
            </CardContent>
            <div className="px-6 pb-4 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => onComponentSelect(component)}
              >
                <Eye className="w-3 h-3 mr-1" />
                Preview
              </Button>
              <Button
                size="sm"
                className="flex-1"
                onClick={() => onInsertComponent(component.metadata.id)}
              >
                <Zap className="w-3 h-3 mr-1" />
                Insert
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {sortedComponents.length > 6 && (
        <div className="text-center">
          <Button variant="outline" onClick={() => setShowComponentBrowser(true)}>
            View All Components
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}

// Template Grid Component
interface TemplateGridProps {
  templates: Template[];
  onTemplateSelect: (template: Template) => void;
  onInsertTemplate: (templateId: string) => void;
}

function TemplateGrid({ templates, onTemplateSelect, onInsertTemplate }: TemplateGridProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Available Templates</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.slice(0, 6).map((template) => (
          <Card key={template.id} className="group cursor-pointer transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {template.description}
              </p>
              {template.tags && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {template.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
            <div className="px-6 pb-4 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => onTemplateSelect(template)}
              >
                <Eye className="w-3 h-3 mr-1" />
                Preview
              </Button>
              <Button
                size="sm"
                className="flex-1"
                onClick={() => onInsertTemplate(template.id)}
              >
                <Zap className="w-3 h-3 mr-1" />
                Insert
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {templates.length > 6 && (
        <div className="text-center">
          <Button variant="outline" onClick={() => setShowTemplateBrowser(true)}>
            View All Templates
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}