// Component Browser Component
// Unified interface for browsing and managing components and templates

"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useComponentLibrary } from '@/hooks/use-component-library';
import { useDesignConfig } from '@/hooks/use-design-config';
import { useLivePreview } from '@/hooks/use-live-preview';
import {
  ComponentDefinition,
  ComponentCategory,
  ComponentLibraryItem
} from '@/types/component-library';
import { Template } from '@/data/templates';
import {
  Search,
  Star,
  StarOff,
  Download,
  Eye,
  Code,
  Settings,
  Filter,
  Grid,
  List,
  Heart,
  Zap,
  Palette,
  Layers
} from 'lucide-react';

interface ComponentBrowserProps {
  onComponentSelect?: (component: ComponentDefinition) => void;
  onTemplateSelect?: (template: Template) => void;
  onInsertComponent?: (componentId: string, variant?: string) => void;
  onInsertTemplate?: (templateId: string) => void;
  showTemplates?: boolean;
  showComponents?: boolean;
  defaultView?: 'grid' | 'list';
  className?: string;
}

export function ComponentBrowser({
  onComponentSelect,
  onTemplateSelect,
  onInsertComponent,
  onInsertTemplate,
  showTemplates = true,
  showComponents = true,
  defaultView = 'grid',
  className = ''
}: ComponentBrowserProps) {
  const { state: componentState, actions: componentActions } = useComponentLibrary();
  const { config: designConfig } = useDesignConfig();
  const { actions: livePreviewActions } = useLivePreview();

  // Browser state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'components' | 'templates'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(defaultView);
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'recent' | 'popular'>('name');
  const [showFavorites, setShowFavorites] = useState(false);

  // Filter and sort components
  const filteredComponents = useMemo(() => {
    let filtered = Array.from(componentState.components.values());

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(component =>
        component.metadata.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.metadata.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.metadata.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(component => component.metadata.category === selectedCategory);
    }

    // Favorites filter
    if (showFavorites) {
      filtered = filtered.filter(component => componentState.favorites.has(component.metadata.id));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.metadata.name.localeCompare(b.metadata.name);
        case 'category':
          return a.metadata.category.localeCompare(b.metadata.category);
        case 'recent':
          return (componentState.recentlyUsed.indexOf(a.metadata.id) - componentState.recentlyUsed.indexOf(b.metadata.id));
        case 'popular':
          return (b.usageCount || 0) - (a.usageCount || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    componentState.components,
    componentState.favorites,
    componentState.recentlyUsed,
    searchQuery,
    selectedCategory,
    showFavorites,
    sortBy
  ]);

  // Get categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    Array.from(componentState.components.values()).forEach(component => {
      cats.add(component.metadata.category);
    });
    return Array.from(cats);
  }, [componentState.components]);

  // Handle component insertion
  const handleInsertComponent = async (component: ComponentLibraryItem, variant?: string) => {
    try {
      if (onInsertComponent) {
        onInsertComponent(component.metadata.id, variant);
      }

      // Generate and insert code
      const generatedCode = componentActions.generateComponentCode(
        component.metadata.id,
        variant ? component.variants.find(v => v.id === variant)?.props || {} : {},
        variant
      );

      // Update live preview
      livePreviewActions.updateHTML(livePreviewActions.state.htmlContent + generatedCode.html);
      if (generatedCode.css) {
        livePreviewActions.updateCSS(livePreviewActions.state.cssContent + generatedCode.css);
      }
      if (generatedCode.js) {
        livePreviewActions.updateJS(livePreviewActions.state.jsContent + generatedCode.js);
      }

      // Mark as recently used
      componentActions.addToRecentlyUsed(component.metadata.id);

    } catch (error) {
      console.error('Failed to insert component:', error);
    }
  };

  // Handle favorite toggle
  const handleToggleFavorite = (componentId: string) => {
    if (componentState.favorites.has(componentId)) {
      componentActions.removeFromFavorites(componentId);
    } else {
      componentActions.addToFavorites(componentId);
    }
  };

  // Component card component
  const ComponentCard = ({ component }: { component: ComponentLibraryItem }) => (
    <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{component.metadata.name}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {component.metadata.description}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleToggleFavorite(component.metadata.id)}
          >
            {componentState.favorites.has(component.metadata.id) ? (
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ) : (
              <StarOff className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="text-xs">
            {component.metadata.category}
          </Badge>
          {component.metadata.featured && (
            <Badge variant="default" className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500">
              Featured
            </Badge>
          )}
          {component.usageCount > 0 && (
            <Badge variant="outline" className="text-xs">
              {component.usageCount} uses
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          {component.metadata.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {component.metadata.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{component.metadata.tags.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onComponentSelect?.(component)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => handleInsertComponent(component)}
          >
            <Zap className="w-4 h-4 mr-2" />
            Insert
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onComponentSelect?.(component)}
          >
            <Code className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );

  // Component list item component
  const ComponentListItem = ({ component }: { component: ComponentLibraryItem }) => (
    <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
        <Layers className="w-6 h-6 text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-sm truncate">{component.metadata.name}</h3>
          <Badge variant="secondary" className="text-xs">
            {component.metadata.category}
          </Badge>
          {component.metadata.featured && (
            <Badge variant="default" className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500">
              Featured
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">{component.metadata.description}</p>
        <div className="flex items-center gap-2 mt-1">
          {component.metadata.tags.slice(0, 2).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {component.usageCount > 0 && (
            <span className="text-xs text-muted-foreground">{component.usageCount} uses</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleToggleFavorite(component.metadata.id)}
        >
          {componentState.favorites.has(component.metadata.id) ? (
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ) : (
            <StarOff className="w-4 h-4" />
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onComponentSelect?.(component)}
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
        <Button
          size="sm"
          onClick={() => handleInsertComponent(component)}
        >
          <Zap className="w-4 h-4 mr-2" />
          Insert
        </Button>
      </div>
    </div>
  );

  return (
    <div className={`w-full h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Sort by Name</SelectItem>
              <SelectItem value="category">Sort by Category</SelectItem>
              <SelectItem value="recent">Recently Used</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={showFavorites ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFavorites(!showFavorites)}
            >
              <Heart className={`w-4 h-4 mr-2 ${showFavorites ? 'fill-current' : ''}`} />
              Favorites
            </Button>
            <div className="border-l h-6" />
            <Button
              variant={viewMode === 'grid' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-4">
        {componentState.isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading components...</p>
            </div>
          </div>
        ) : filteredComponents.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Palette className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No components found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Try adjusting your search terms' : 'No components match the current filters'}
              </p>
            </div>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "space-y-2"
          }>
            {filteredComponents.map(component => (
              viewMode === 'grid' ? (
                <ComponentCard key={component.metadata.id} component={component} />
              ) : (
                <ComponentListItem key={component.metadata.id} component={component} />
              )
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4 bg-muted/50">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {filteredComponents.length} component{filteredComponents.length !== 1 ? 's' : ''} found
            {componentState.favorites.size > 0 && ` • ${componentState.favorites.size} favorite${componentState.favorites.size !== 1 ? 's' : ''}`}
          </span>
          <div className="flex items-center gap-4">
            <span>Design System: {designConfig.mode}</span>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Manage Components
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}