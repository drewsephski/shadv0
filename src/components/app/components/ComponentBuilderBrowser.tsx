// Component Builder Browser
// Specialized component library browser for the component builder

"use client";

import { useState } from 'react';
import { useComponentLibrary } from '@/hooks/use-component-library';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Search,
  Grid,
  List,
  Layers,
  Star,
  StarOff,
  Copy,
  Info,
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react';

interface ComponentBuilderBrowserProps {
  onComponentSelect?: (componentId: string) => void;
  onComponentInsert?: (componentId: string) => void;
  selectedComponentId?: string;
}

export function ComponentBuilderBrowser({
  onComponentSelect,
  onComponentInsert,
  selectedComponentId
}: ComponentBuilderBrowserProps) {
  const componentLibrary = useComponentLibrary();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'usage'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // Get filtered and sorted components
  const filteredComponents = () => {
    let components = Array.from(componentLibrary.state.components.values());

    // Filter by search query
    if (searchQuery) {
      components = components.filter(component =>
        component.metadata.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.metadata.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.metadata.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      components = components.filter(component =>
        component.metadata.category === selectedCategory
      );
    }

    // Filter favorites
    if (favoritesOnly) {
      components = components.filter(component =>
        componentLibrary.state.favorites.has(component.metadata.id)
      );
    }

    // Sort components
    components.sort((a, b) => {
      let aValue: string | number = a.metadata.name;
      let bValue: string | number = b.metadata.name;

      switch (sortBy) {
        case 'category':
          aValue = a.metadata.category;
          bValue = b.metadata.category;
          break;
        case 'usage':
          aValue = a.usageCount;
          bValue = b.usageCount;
          break;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
      }
    });

    return components;
  };

  // Get unique categories
  const categories = Array.from(
    new Set(Array.from(componentLibrary.state.components.values()).map(c => c.metadata.category))
  );

  const handleComponentClick = (componentId: string) => {
    onComponentSelect?.(componentId);
  };

  const handleInsertComponent = (componentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onComponentInsert?.(componentId);
  };

  const toggleFavorite = (componentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (componentLibrary.state.favorites.has(componentId)) {
      componentLibrary.actions.removeFromFavorites(componentId);
    } else {
      componentLibrary.actions.addToFavorites(componentId);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="h-full flex flex-col bg-card border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Component Library
          </h3>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-accent' : ''}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-accent' : ''}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 px-3 py-1 text-sm border rounded bg-background"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <Button
            variant={favoritesOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setFavoritesOnly(!favoritesOnly)}
          >
            <Star className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleSortOrder}
          >
            {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </Button>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{filteredComponents().length} components</span>
          <span>Sorted by {sortBy}</span>
        </div>
      </div>

      {/* Component List */}
      <ScrollArea className="flex-1 p-4">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredComponents().map(component => (
              <Card
                key={component.metadata.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedComponentId === component.metadata.id
                    ? 'ring-2 ring-primary border-primary'
                    : 'hover:border-accent'
                }`}
                onClick={() => handleComponentClick(component.metadata.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                        <Layers className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-sm">{component.metadata.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {component.metadata.category}
                        </Badge>
                      </div>
                    </div>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => toggleFavorite(component.metadata.id, e)}
                          >
                            {componentLibrary.state.favorites.has(component.metadata.id) ? (
                              <Star className="h-3 w-3 fill-current" />
                            ) : (
                              <StarOff className="h-3 w-3" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {componentLibrary.state.favorites.has(component.metadata.id) ? 'Remove from favorites' : 'Add to favorites'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <CardDescription className="text-xs mb-3 line-clamp-2">
                    {component.metadata.description}
                  </CardDescription>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {component.metadata.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={(e) => handleInsertComponent(component.metadata.id, e)}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Insert
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Insert component into canvas</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredComponents().map(component => (
              <div
                key={component.metadata.id}
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                  selectedComponentId === component.metadata.id ? 'border-primary bg-accent' : ''
                }`}
                onClick={() => handleComponentClick(component.metadata.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                    <Layers className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{component.metadata.name}</p>
                    <p className="text-xs text-muted-foreground">{component.metadata.description}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {component.metadata.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Used {component.usageCount} times
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => toggleFavorite(component.metadata.id, e)}
                  >
                    {componentLibrary.state.favorites.has(component.metadata.id) ? (
                      <Star className="h-4 w-4 fill-current" />
                    ) : (
                      <StarOff className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    size="sm"
                    onClick={(e) => handleInsertComponent(component.metadata.id, e)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Insert
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredComponents().length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No components found</p>
            <p className="text-xs">Try adjusting your search or filters</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}