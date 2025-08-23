// ComponentLibraryBrowser Component
// Comprehensive unified browser for components and templates with Shadcn UI integration

"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useComponentLibrary } from '@/hooks/use-component-library';
import { useDesignConfig } from '@/hooks/use-design-config';
import { useLivePreview } from '@/hooks/use-live-preview';
import {
  ComponentDefinition,
  ComponentCategory,
  ComponentLibraryItem
} from '@/types/component-library';
import { Template, templates } from '@/data/templates';
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
  Layers,
  FileText,
  Navigation,
  CreditCard,
  ShoppingCart,
  BarChart2,
  Rocket,
  MessageSquare,
  Link2,
  ChevronRight,
  ChevronDown,
  X,
  Plus,
  Copy,
  Share,
  MoreHorizontal,
  Clock,
  Tag,
  Bookmark,
  BookmarkCheck,
  Layout,
  Smartphone,
  Monitor,
  Tablet,
  Accessibility,
  Keyboard,
  MousePointer,
  Move,
  RotateCcw,
  Trash2,
  Edit,
  Save,
  Upload,
  Download as DownloadIcon,
  ExternalLink,
  Info,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface ComponentLibraryBrowserProps {
  onComponentInsert?: (componentId: string, variant?: string) => void;
  onTemplateInsert?: (templateId: string) => void;
  onComponentSelect?: (component: ComponentDefinition) => void;
  onTemplateSelect?: (template: Template) => void;
  showTemplates?: boolean;
  showComponents?: boolean;
  defaultView?: 'grid' | 'list';
  defaultCategory?: string;
  className?: string;
  enableDragDrop?: boolean;
  enableFavorites?: boolean;
  enableRecentlyUsed?: boolean;
  enableSearch?: boolean;
  enableFiltering?: boolean;
  enableKeyboardNavigation?: boolean;
  maxItemsPerPage?: number;
}

type ViewMode = 'grid' | 'list';
type ContentType = 'all' | 'components' | 'templates';
type SortOption = 'name' | 'category' | 'recent' | 'popular' | 'featured';

interface BrowserState {
  searchQuery: string;
  selectedCategory: string;
  selectedType: ContentType;
  viewMode: ViewMode;
  sortBy: SortOption;
  showFavorites: boolean;
  showRecentlyUsed: boolean;
  currentPage: number;
  itemsPerPage: number;
  selectedItem: string | null;
  previewItem: string | null;
  draggedItem: string | null;
}

interface RecentlyUsedItem {
  id: string;
  name: string;
  type: 'component' | 'template';
  category: string;
  lastUsed: number;
  useCount: number;
}

interface FavoriteItem {
  id: string;
  name: string;
  type: 'component' | 'template';
  category: string;
  addedAt: number;
}

type LibraryItem = ComponentLibraryItem | Template;

interface UnifiedLibraryItem {
  type: 'component' | 'template';
  data: LibraryItem;
  id: string;
  name: string;
  category: string;
  tags: string[];
}

const categoryIcons: Record<string, React.ElementType> = {
  'layout': Layout,
  'navigation': Navigation,
  'forms': FileText,
  'data-display': BarChart2,
  'feedback': MessageSquare,
  'overlay': Layers,
  'media': Smartphone,
  'typography': FileText,
  'icons': Star,
  'charts': BarChart2,
  'ecommerce': ShoppingCart,
  'social': MessageSquare,
  'utilities': Settings,
  'hero': Rocket,
  'cards': CreditCard,
  'pricing': CreditCard,
  'features': Zap,
  'cta': Rocket,
  'content-section': FileText,
  'dashboard': BarChart2,
  'testimonial': MessageSquare,
  'footer': Link2,
  'landing-page': Rocket,
};

export function ComponentLibraryBrowser({
  onComponentInsert,
  onTemplateInsert,
  onComponentSelect,
  onTemplateSelect,
  showTemplates = true,
  showComponents = true,
  defaultView = 'grid',
  defaultCategory = 'all',
  className = '',
  enableDragDrop = true,
  enableFavorites = true,
  enableRecentlyUsed = true,
  enableSearch = true,
  enableFiltering = true,
  enableKeyboardNavigation = true,
  maxItemsPerPage = 24
}: ComponentLibraryBrowserProps) {
  const { state: componentState, actions: componentActions } = useComponentLibrary();
  const { config: designConfig } = useDesignConfig();
  const { actions: livePreviewActions } = useLivePreview();

  // Browser state
  const [browserState, setBrowserState] = useState<BrowserState>({
    searchQuery: '',
    selectedCategory: defaultCategory,
    selectedType: 'all',
    viewMode: defaultView,
    sortBy: 'name',
    showFavorites: false,
    showRecentlyUsed: false,
    currentPage: 1,
    itemsPerPage: maxItemsPerPage,
    selectedItem: null,
    previewItem: null,
    draggedItem: null
  });

  // Local storage state for favorites and recently used
  const [recentlyUsed, setRecentlyUsed] = useState<RecentlyUsedItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Refs for accessibility and drag-drop
  const browserRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedRecentlyUsed = localStorage.getItem('component-library-recently-used');
    const savedFavorites = localStorage.getItem('component-library-favorites');

    if (savedRecentlyUsed) {
      try {
        setRecentlyUsed(JSON.parse(savedRecentlyUsed));
      } catch (error) {
        console.error('Failed to load recently used items:', error);
      }
    }

    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Failed to load favorites:', error);
      }
    }
  }, []);

  // Save data to localStorage
  const saveRecentlyUsed = useCallback((items: RecentlyUsedItem[]) => {
    setRecentlyUsed(items);
    localStorage.setItem('component-library-recently-used', JSON.stringify(items));
  }, []);

  const saveFavorites = useCallback((items: FavoriteItem[]) => {
    setFavorites(items);
    localStorage.setItem('component-library-favorites', JSON.stringify(items));
  }, []);

  // Add to recently used
  const addToRecentlyUsed = useCallback((id: string, name: string, type: 'component' | 'template', category: string) => {
    const newItem: RecentlyUsedItem = {
      id,
      name,
      type,
      category,
      lastUsed: Date.now(),
      useCount: 1
    };

    const updated = [newItem, ...recentlyUsed.filter(item => item.id !== id)].slice(0, 20);
    const existing = recentlyUsed.find(item => item.id === id);
    if (existing) {
      existing.useCount += 1;
      existing.lastUsed = Date.now();
    }

    saveRecentlyUsed(updated);
  }, [recentlyUsed, saveRecentlyUsed]);

  // Toggle favorite
  const toggleFavorite = useCallback((id: string, name: string, type: 'component' | 'template', category: string) => {
    const isFavorite = favorites.some(item => item.id === id);

    if (isFavorite) {
      const updated = favorites.filter(item => item.id !== id);
      saveFavorites(updated);
    } else {
      const newFavorite: FavoriteItem = {
        id,
        name,
        type,
        category,
        addedAt: Date.now()
      };
      const updated = [newFavorite, ...favorites];
      saveFavorites(updated);
    }
  }, [favorites, saveFavorites]);

  // Check if item is favorite
  const isFavorite = useCallback((id: string) => {
    return favorites.some(item => item.id === id);
  }, [favorites]);

  // Get templates - already imported above
  // const templates = useMemo(() => templates, []);

  // Get all categories
  const allCategories = useMemo(() => {
    const componentCategories = new Set<string>();
    Array.from(componentState.components.values()).forEach(component => {
      componentCategories.add(component.metadata.category);
    });

    const templateCategories = new Set<string>();
    templates.forEach((template: Template) => {
      if (template.category) {
        templateCategories.add(template.category);
      }
      if (template.tags) {
        template.tags.forEach(tag => templateCategories.add(tag));
      }
    });

    return Array.from(new Set([...componentCategories, ...templateCategories]));
  }, [componentState.components, templates]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let items: UnifiedLibraryItem[] = [];

    // Add components
    if (showComponents && (browserState.selectedType === 'all' || browserState.selectedType === 'components')) {
      Array.from(componentState.components.values()).forEach(component => {
        items.push({
          type: 'component',
          data: component,
          id: component.metadata.id,
          name: component.metadata.name,
          category: component.metadata.category,
          tags: component.metadata.tags
        });
      });
    }

    // Add templates
    if (showTemplates && (browserState.selectedType === 'all' || browserState.selectedType === 'templates')) {
      templates.forEach((template: Template) => {
        items.push({
          type: 'template',
          data: template,
          id: template.id,
          name: template.name,
          category: template.category || 'general',
          tags: template.tags || []
        });
      });
    }

    // Search filter
    if (browserState.searchQuery) {
      const query = browserState.searchQuery.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (browserState.selectedCategory !== 'all') {
      items = items.filter(item => item.category === browserState.selectedCategory);
    }

    // Favorites filter
    if (browserState.showFavorites) {
      items = items.filter(item => isFavorite(item.id));
    }

    // Recently used filter
    if (browserState.showRecentlyUsed) {
      const recentIds = recentlyUsed.map(item => item.id);
      items = items.filter(item => recentIds.includes(item.id));
    }

    // Sort
    items.sort((a, b) => {
      switch (browserState.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'recent':
          const aRecent = recentlyUsed.find(item => item.id === a.id);
          const bRecent = recentlyUsed.find(item => item.id === b.id);
          if (aRecent && bRecent) return bRecent.lastUsed - aRecent.lastUsed;
          if (aRecent) return -1;
          if (bRecent) return 1;
          return 0;
        case 'popular':
          const aRecentPopular = recentlyUsed.find(item => item.id === a.id);
          const bRecentPopular = recentlyUsed.find(item => item.id === b.id);
          if (aRecentPopular && bRecentPopular) return bRecentPopular.useCount - aRecentPopular.useCount;
          if (aRecentPopular) return -1;
          if (bRecentPopular) return 1;
          return 0;
        case 'featured':
          const aFeatured = a.type === 'component' ? (a.data as ComponentLibraryItem).metadata.featured : (a.data as Template).featured;
          const bFeatured = b.type === 'component' ? (b.data as ComponentLibraryItem).metadata.featured : (b.data as Template).featured;
          if (aFeatured && !bFeatured) return -1;
          if (!aFeatured && bFeatured) return 1;
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return items;
  }, [
    browserState,
    componentState.components,
    templates,
    showComponents,
    showTemplates,
    recentlyUsed,
    isFavorite
  ]);

  // Paginated items
  const paginatedItems = useMemo(() => {
    const startIndex = (browserState.currentPage - 1) * browserState.itemsPerPage;
    const endIndex = startIndex + browserState.itemsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, browserState.currentPage, browserState.itemsPerPage]);

  // Total pages
  const totalPages = Math.ceil(filteredItems.length / browserState.itemsPerPage);

  // Update browser state
  const updateBrowserState = useCallback((updates: Partial<BrowserState>) => {
    setBrowserState(prev => ({ ...prev, ...updates }));
  }, []);

  // Handle component/template insertion
  const handleInsert = useCallback((item: typeof paginatedItems[0]) => {
    addToRecentlyUsed(item.id, item.name, item.type, item.category);

    if (item.type === 'component') {
      onComponentInsert?.(item.id);
    } else {
      onTemplateInsert?.(item.id);
    }
  }, [addToRecentlyUsed, onComponentInsert, onTemplateInsert]);

  // Handle item selection
  const handleSelect = useCallback((item: typeof paginatedItems[0]) => {
    if (item.type === 'component') {
      onComponentSelect?.(item.data);
    } else {
      onTemplateSelect?.(item.data);
    }
  }, [onComponentSelect, onTemplateSelect]);

  // Keyboard navigation
  useEffect(() => {
    if (!enableKeyboardNavigation) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const { key, ctrlKey, metaKey } = event;

      switch (key) {
        case 'ArrowUp':
          event.preventDefault();
          // Navigate up
          break;
        case 'ArrowDown':
          event.preventDefault();
          // Navigate down
          break;
        case 'ArrowLeft':
          event.preventDefault();
          // Navigate left
          break;
        case 'ArrowRight':
          event.preventDefault();
          // Navigate right
          break;
        case 'Enter':
          event.preventDefault();
          if (browserState.selectedItem) {
            const item = paginatedItems.find(item => item.id === browserState.selectedItem);
            if (item) handleInsert(item);
          }
          break;
        case ' ':
          event.preventDefault();
          if (browserState.selectedItem) {
            const item = paginatedItems.find(item => item.id === browserState.selectedItem);
            if (item) handleSelect(item);
          }
          break;
        case 'f':
          if (ctrlKey || metaKey) {
            event.preventDefault();
            // Focus search input
            const searchInput = browserRef.current?.querySelector('input[type="search"]') as HTMLInputElement;
            searchInput?.focus();
          }
          break;
        case 'g':
          if (ctrlKey || metaKey) {
            event.preventDefault();
            updateBrowserState({ viewMode: browserState.viewMode === 'grid' ? 'list' : 'grid' });
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboardNavigation, browserState, paginatedItems, handleInsert, handleSelect, updateBrowserState]);

  // Drag and drop handlers
  const handleDragStart = useCallback((event: React.DragEvent, itemId: string) => {
    if (!enableDragDrop) return;

    updateBrowserState({ draggedItem: itemId });
    event.dataTransfer.setData('text/plain', itemId);
    event.dataTransfer.effectAllowed = 'copy';
  }, [enableDragDrop, updateBrowserState]);

  const handleDragEnd = useCallback(() => {
    updateBrowserState({ draggedItem: null });
  }, [updateBrowserState]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const itemId = event.dataTransfer.getData('text/plain');
    const item = filteredItems.find(item => item.id === itemId);

    if (item) {
      handleInsert(item);
    }
  }, [filteredItems, handleInsert]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  // Render category tabs
  const renderCategoryTabs = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        variant={browserState.selectedCategory === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => updateBrowserState({ selectedCategory: 'all' })}
        className="flex items-center gap-2"
      >
        <Layers className="w-4 h-4" />
        All Categories
      </Button>
      {allCategories.map(category => {
        const Icon = categoryIcons[category] || Layers;
        return (
          <Button
            key={category}
            variant={browserState.selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateBrowserState({ selectedCategory: category })}
            className="flex items-center gap-2"
          >
            <Icon className="w-4 h-4" />
            {category}
          </Button>
        );
      })}
    </div>
  );

  // Render search and filters
  const renderSearchAndFilters = () => (
    <div className="space-y-4">
      {/* Search */}
      {enableSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search components and templates..."
            value={browserState.searchQuery}
            onChange={(e) => updateBrowserState({ searchQuery: e.target.value, currentPage: 1 })}
            className="pl-10"
          />
        </div>
      )}

      {/* Filters */}
      {enableFiltering && (
        <div className="flex flex-wrap gap-4 items-center">
          {/* Type Filter */}
          <Select
            value={browserState.selectedType}
            onValueChange={(value: ContentType) => updateBrowserState({ selectedType: value, currentPage: 1 })}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Content Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {showComponents && <SelectItem value="components">Components</SelectItem>}
              {showTemplates && <SelectItem value="templates">Templates</SelectItem>}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select
            value={browserState.sortBy}
            onValueChange={(value: SortOption) => updateBrowserState({ sortBy: value })}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="category">Category</SelectItem>
              <SelectItem value="recent">Recently Used</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <div className="flex items-center gap-1 border rounded-md">
            <Button
              variant={browserState.viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => updateBrowserState({ viewMode: 'grid' })}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={browserState.viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => updateBrowserState({ viewMode: 'list' })}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Filters */}
          {enableFavorites && (
            <Button
              variant={browserState.showFavorites ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateBrowserState({ showFavorites: !browserState.showFavorites, currentPage: 1 })}
            >
              <Heart className={`w-4 h-4 mr-2 ${browserState.showFavorites ? 'fill-current' : ''}`} />
              Favorites ({favorites.length})
            </Button>
          )}

          {enableRecentlyUsed && (
            <Button
              variant={browserState.showRecentlyUsed ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateBrowserState({ showRecentlyUsed: !browserState.showRecentlyUsed, currentPage: 1 })}
            >
              <Clock className="w-4 h-4 mr-2" />
              Recent ({recentlyUsed.length})
            </Button>
          )}
        </div>
      )}
    </div>
  );

  // Render grid item
  const renderGridItem = (item: typeof paginatedItems[0]) => {
    const Icon = categoryIcons[item.category] || Layers;
    const isFav = isFavorite(item.id);
    const isRecent = recentlyUsed.some(recent => recent.id === item.id);

    return (
      <Card
        key={item.id}
        className={`group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer ${
          browserState.selectedItem === item.id ? 'ring-2 ring-primary' : ''
        } ${browserState.draggedItem === item.id ? 'opacity-50' : ''}`}
        onClick={() => handleSelect(item)}
        draggable={enableDragDrop}
        onDragStart={(e) => handleDragStart(e, item.id)}
        onDragEnd={handleDragEnd}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold line-clamp-1">{item.name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {item.type === 'component' ? 'Component' : 'Template'}
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {enableFavorites && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id, item.name, item.type, item.category);
                  }}
                >
                  {isFav ? (
                    <BookmarkCheck className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(item);
                }}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="text-xs">
              {item.category}
            </Badge>
            {isRecent && (
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                Recent
              </Badge>
            )}
            {isFav && (
              <Badge variant="outline" className="text-xs">
                <Heart className="w-3 h-3 mr-1" />
                Favorite
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {item.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{item.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>

        <div className="px-6 pb-4 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              handleSelect(item);
            }}
          >
            <Eye className="w-3 h-3 mr-1" />
            Preview
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              handleInsert(item);
            }}
          >
            <Zap className="w-3 h-3 mr-1" />
            Insert
          </Button>
        </div>

        {/* Hover Preview */}
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="p-4 text-white">
            <h3 className="font-semibold mb-2">{item.name}</h3>
            <p className="text-sm text-gray-300 line-clamp-3">
              {item.type === 'component'
                ? (item.data as ComponentLibraryItem).metadata.description
                : (item.data as Template).description
              }
            </p>
          </div>
        </div>
      </Card>
    );
  };

  // Render list item
  const renderListItem = (item: typeof paginatedItems[0]) => {
    const Icon = categoryIcons[item.category] || Layers;
    const isFav = isFavorite(item.id);
    const isRecent = recentlyUsed.some(recent => recent.id === item.id);

    return (
      <div
        key={item.id}
        className={`flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ${
          browserState.selectedItem === item.id ? 'ring-2 ring-primary' : ''
        } ${browserState.draggedItem === item.id ? 'opacity-50' : ''}`}
        onClick={() => handleSelect(item)}
        draggable={enableDragDrop}
        onDragStart={(e) => handleDragStart(e, item.id)}
        onDragEnd={handleDragEnd}
      >
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm truncate">{item.name}</h3>
            <Badge variant="secondary" className="text-xs">
              {item.category}
            </Badge>
            {isRecent && (
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                Recent
              </Badge>
            )}
            {isFav && (
              <Badge variant="outline" className="text-xs">
                <Heart className="w-3 h-3 mr-1" />
                Favorite
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {item.type === 'component'
              ? (item.data as ComponentLibraryItem).metadata.description
              : (item.data as Template).description
            }
          </p>
          <div className="flex items-center gap-2 mt-1">
            {item.tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {item.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{item.tags.length - 2}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {enableFavorites && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(item.id, item.name, item.type, item.category);
              }}
            >
              {isFav ? (
                <BookmarkCheck className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleSelect(item);
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleInsert(item);
            }}
          >
            <Zap className="w-4 h-4 mr-2" />
            Insert
          </Button>
        </div>
      </div>
    );
  };

  // Render pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-muted-foreground">
          Showing {Math.min((browserState.currentPage - 1) * browserState.itemsPerPage + 1, filteredItems.length)} to{' '}
          {Math.min(browserState.currentPage * browserState.itemsPerPage, filteredItems.length)} of {filteredItems.length} items
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateBrowserState({ currentPage: Math.max(1, browserState.currentPage - 1) })}
            disabled={browserState.currentPage === 1}
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (browserState.currentPage <= 3) {
                pageNum = i + 1;
              } else if (browserState.currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = browserState.currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={browserState.currentPage === pageNum ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateBrowserState({ currentPage: pageNum })}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => updateBrowserState({ currentPage: Math.min(totalPages, browserState.currentPage + 1) })}
            disabled={browserState.currentPage === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div
        ref={browserRef}
        className={`w-full h-full flex flex-col bg-background text-foreground ${className}`}
        role="application"
        aria-label="Component Library Browser"
      >
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Palette className="w-6 h-6" />
                Component Library Browser
              </h2>
              <p className="text-muted-foreground">Browse, search, and insert components and templates</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {filteredItems.length} items
              </Badge>
              <Badge variant="outline">
                {favorites.length} favorites
              </Badge>
              <Badge variant="outline">
                {recentlyUsed.length} recent
              </Badge>
            </div>
          </div>

          {/* Search and Filters */}
          {renderSearchAndFilters()}

          {/* Category Tabs */}
          {renderCategoryTabs()}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          {/* Drop Zone */}
          {enableDragDrop && (
            <div
              ref={dropZoneRef}
              className="mb-4 p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <Move className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Drag and drop components here to insert them</p>
            </div>
          )}

          {/* Items Grid/List */}
          {componentState.isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading components...</p>
              </div>
            </div>
          ) : paginatedItems.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No items found</h3>
                <p className="text-muted-foreground">
                  {browserState.searchQuery ? 'Try adjusting your search terms' : 'No items match the current filters'}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className={
                browserState.viewMode === 'grid'
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "space-y-2"
              }>
                {paginatedItems.map(item => (
                  browserState.viewMode === 'grid'
                    ? renderGridItem(item)
                    : renderListItem(item)
                ))}
              </div>

              {/* Pagination */}
              {renderPagination()}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-muted/50">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Design System: {designConfig.mode}</span>
              <span>•</span>
              <span>Items: {filteredItems.length}</span>
              <span>•</span>
              <span>Page {browserState.currentPage} of {totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
              {enableKeyboardNavigation && (
                <div className="flex items-center gap-1 text-xs">
                  <Keyboard className="w-3 h-3" />
                  <span>Keyboard shortcuts available</span>
                </div>
              )}

              {enableDragDrop && (
                <div className="flex items-center gap-1 text-xs">
                  <MousePointer className="w-3 h-3" />
                  <span>Drag & drop enabled</span>
                </div>
              )}

              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Help */}
        {enableKeyboardNavigation && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="absolute bottom-4 right-4">
                <Keyboard className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Keyboard Shortcuts</DialogTitle>
                <DialogDescription>
                  Use these keyboard shortcuts to navigate the component library efficiently.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Navigation:</strong>
                  <ul className="mt-2 space-y-1">
                    <li><code>↑↓</code> - Navigate up/down</li>
                    <li><code>←→</code> - Navigate left/right</li>
                    <li><code>Enter</code> - Insert selected item</li>
                    <li><code>Space</code> - Preview selected item</li>
                  </ul>
                </div>
                <div>
                  <strong>Actions:</strong>
                  <ul className="mt-2 space-y-1">
                    <li><code>Ctrl/Cmd + F</code> - Focus search</li>
                    <li><code>Ctrl/Cmd + G</code> - Toggle view mode</li>
                    <li><code>Escape</code> - Clear selection</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </TooltipProvider>
  );
}