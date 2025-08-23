"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { templates, Template } from '@/data/templates';
import { DesignConfigModal } from './DesignConfigModal';
import { useDesignConfig } from '@/hooks/use-design-config';
import {
  Search, Sparkles, Layout, Navigation, FileText, CreditCard, ShoppingCart,
  BarChart2, Rocket, Star, MessageSquare, Link2, Zap, Palette
} from 'lucide-react';

interface TemplateBrowserProps {
  onSelectTemplate: (data: { prompt: string; htmlCode: string; config?: any }) => void;
}

export function TemplateBrowser({ onSelectTemplate }: TemplateBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const {
    config,
    isModalOpen,
    openConfigModal,
    closeConfigModal,
    saveConfig,
    generatePromptContext
  } = useDesignConfig();

  const categories = [
    { id: 'all', name: 'All Templates', icon: Layout },
    { id: 'hero', name: 'Hero Sections', icon: Star },
    { id: 'navigation', name: 'Navigation', icon: Navigation },
    { id: 'forms', name: 'Forms', icon: FileText },
    { id: 'cards', name: 'Cards', icon: CreditCard },
    { id: 'ecommerce', name: 'E-commerce', icon: ShoppingCart },
    { id: 'dashboard', name: 'Dashboard', icon: BarChart2 },
    { id: 'landing', name: 'Landing Pages', icon: Rocket },
    { id: 'testimonial', name: 'Testimonials', icon: MessageSquare },
    { id: 'footer', name: 'Footers', icon: Link2 },
    { id: 'pricing', name: 'Pricing', icon: CreditCard },
    { id: 'features', name: 'Features', icon: Zap },
    { id: 'cta', name: 'Call to Action', icon: Rocket },
    { id: 'content-section', name: 'Content Sections', icon: FileText },
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesCategory = selectedCategory === 'all';

    if (!matchesCategory) {
      // Check if template has a category that matches
      if (template.category && template.category === selectedCategory) {
        matchesCategory = true;
      }
      // Check if template tags match the selected category
      else if (template.tags && template.tags.some(tag =>
        tag.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        selectedCategory.toLowerCase().includes(tag.toLowerCase())
      )) {
        matchesCategory = true;
      }
      // Special cases for templates that don't have proper categories
      else if (selectedCategory === 'pricing' && (template.id.includes('pricing') || template.tags?.includes('pricing'))) {
        matchesCategory = true;
      }
      else if (selectedCategory === 'testimonial' && (template.id.includes('testimonial') || template.tags?.includes('testimonial'))) {
        matchesCategory = true;
      }
      else if (selectedCategory === 'footer' && (template.id.includes('footer') || template.tags?.includes('footer'))) {
        matchesCategory = true;
      }
      else if (selectedCategory === 'cta' && (template.id.includes('cta') || template.tags?.includes('cta'))) {
        matchesCategory = true;
      }
      else if (selectedCategory === 'dashboard' && (template.id.includes('dashboard') || template.tags?.includes('dashboard'))) {
        matchesCategory = true;
      }
    }

    return matchesSearch && matchesCategory;
  });

  const handleSelectTemplate = (template: Template) => {
    // Generate enhanced prompt with design configuration context
    const enhancedPrompt = generatePromptContext(template.prompt);
    onSelectTemplate({
      prompt: enhancedPrompt,
      htmlCode: template.htmlCode,
      config: config
    });
  };

  const getTemplateIcon = (templateId: string) => {
    if (templateId.includes('hero') || templateId.includes('glassmorphism')) return Rocket;
    if (templateId.includes('navbar') || templateId.includes('footer')) return Navigation;
    if (templateId.includes('form')) return FileText;
    if (templateId.includes('card') || templateId.includes('dark-card') || templateId.includes('pricing-cards') || templateId.includes('testimonial-cards')) return CreditCard;
    if (templateId.includes('ecommerce') || templateId.includes('pricing') || templateId.includes('cart')) return ShoppingCart;
    if (templateId.includes('dashboard') || templateId.includes('table')) return BarChart2;
    if (templateId.includes('testimonial')) return MessageSquare;
    if (templateId.includes('cta')) return Rocket;
    if (templateId.includes('feature')) return Zap;
    return Layout;
  };

  const getIconColor = (templateId: string) => {
    if (templateId.includes('hero') || templateId.includes('glassmorphism')) return 'text-yellow-500';
    if (templateId.includes('navbar') || templateId.includes('footer')) return 'text-blue-500';
    if (templateId.includes('form')) return 'text-emerald-500';
    if (templateId.includes('card') || templateId.includes('dark-card') || templateId.includes('pricing-cards') || templateId.includes('testimonial-cards')) return 'text-teal-500';
    if (templateId.includes('ecommerce') || templateId.includes('pricing') || templateId.includes('cart')) return 'text-rose-500';
    if (templateId.includes('dashboard') || templateId.includes('table')) return 'text-cyan-500';
    if (templateId.includes('testimonial')) return 'text-amber-500';
    if (templateId.includes('cta')) return 'text-orange-500';
    if (templateId.includes('feature')) return 'text-purple-500';
    return 'text-gray-500';
  };

  return (
    <div className="p-4 overflow-y-auto h-full bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Template Gallery
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Beautiful, modern templates to kickstart your web projects
              </p>
            </div>
          </div>

          <Button
            onClick={openConfigModal}
            variant="outline"
            className="flex items-center gap-2 border-gray-200 border-[1px] border-solid hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
          >
            <Palette className="h-4 w-4" />
            Customize Design
          </Button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200 border-[1px] border-solid focus:border-blue-500 focus:ring-blue-500/20 h-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 border-solid hover:border-gray-300'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr">
        {filteredTemplates.map((template) => {
          const Icon = getTemplateIcon(template.id);
          const iconColor = getIconColor(template.id);
          return (
            <Card
              key={template.id}
              className="p-0 hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:scale-[1.02] border border-border-/50 bg-card/80 backdrop-blur-md hover:bg-card/90 hover:border-border-/80 h-full shadow-lg"
              onClick={() => handleSelectTemplate(template)}
            >
              <CardHeader className="p-4 pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-gray-50 group-hover:bg-blue-50 transition-all duration-300`}>
                    <Icon className={`size-5 ${iconColor}`} />
                  </div>
                  {template.featured && (
                    <Badge variant="secondary" className="text-xs px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-medium shadow-sm">
                      Featured
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-sm font-bold text-blue-400 leading-tight mb-1 line-clamp-2">
                  {template.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex-1 flex flex-col">
                <CardDescription className="text-xs text-blue-300 line-clamp-3 leading-relaxed mb-3 flex-1">
                  {template.description}
                </CardDescription>
                {template.tags && template.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {template.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs px-2 py-0.5 text-blue-300 border-blue-200 border-[1px] border-solid bg-blue-50/20 hover:bg-blue-100/30 transition-colors">
                        {tag}
                      </Badge>
                    ))}
                    {template.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5 text-blue-200 border-blue-200/50 border-[1px] border-solid bg-blue-50/10">
                        +{template.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Enhanced Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-16">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
          <p className="text-sm text-gray-600 mb-4 max-w-sm mx-auto">
            Try adjusting your search terms or filter criteria to find more templates
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Design Configuration Modal */}
      <DesignConfigModal
        isOpen={isModalOpen}
        onClose={closeConfigModal}
        onSave={saveConfig}
        initialConfig={config}
      />
    </div>
  );
}