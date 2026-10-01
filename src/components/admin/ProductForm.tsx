'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Save,
    Loader2,
    Plus,
    X,
    Trash2,
    Package,
    Palette,
    Ruler,
    Truck,
    Sparkles,
    Check,
    Eye,
    ShieldCheck,
    Tag,
    FileText,
    Layers,
    DollarSign,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct } from '@/actions/products';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import { toast } from 'react-hot-toast';

const COLOR_PRESETS = [
    { name: 'Oatmeal Bouclé', hex: '#EBE7DF' },
    { name: 'Warm Camel', hex: '#9B7C5F' },
    { name: 'Charcoal Black', hex: '#1C1917' },
    { name: 'Chalk White', hex: '#F5F5F0' },
    { name: 'Deep Ocean Navy', hex: '#1E293B' },
    { name: 'Forest Green', hex: '#2D3B2D' },
    { name: 'Stone Grey', hex: '#78716C' },
    { name: 'Warm Terracotta', hex: '#9C4221' },
    { name: 'Cream Beige', hex: '#D6C7B2' },
];

function getSwatchHex(name: string): string {
    const found = COLOR_PRESETS.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (found) return found.hex;
    const lower = name.toLowerCase();
    if (lower.includes('white') || lower.includes('chalk')) return '#F8FAFC';
    if (lower.includes('black') || lower.includes('charcoal')) return '#18181B';
    if (lower.includes('navy') || lower.includes('blue')) return '#1E3A8A';
    if (lower.includes('green') || lower.includes('moss') || lower.includes('olive')) return '#166534';
    if (lower.includes('brown') || lower.includes('camel') || lower.includes('tan')) return '#92400E';
    if (lower.includes('grey') || lower.includes('gray')) return '#71717A';
    if (lower.includes('cream') || lower.includes('beige') || lower.includes('oatmeal')) return '#F5F5DC';
    if (lower.includes('gold') || lower.includes('yellow')) return '#D97706';
    if (lower.includes('red') || lower.includes('terracotta') || lower.includes('rust')) return '#991B1B';
    return '#CBD5E1';
}

interface ProductFormProps {
    brands: any[];
    categories: any[];
    sizes: any[];
    initialData?: any;
}

interface Variant {
    id?: string;
    sizeId: string;
    price: string;
    promoPrice: string;
    stock: string;
    sku?: string;
}

export default function ProductForm({ brands, categories, sizes, initialData }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Active Section for quick jump
    const [activeSection, setActiveSection] = useState<'info' | 'variants' | 'colors' | 'tabs' | 'media'>('info');

    // 1. Basic Info
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [brandId, setBrandId] = useState(initialData?.brandId || '');
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
        initialData?.categories?.map((c: any) => c.categoryId) || []
    );

    // 2. Specifications & Attributes
    const [type, setType] = useState(initialData?.type || '');
    const [materials, setMaterials] = useState(initialData?.materials || '');
    const [firmness, setFirmness] = useState(initialData?.firmness || '');
    const [finishing, setFinishing] = useState(initialData?.finishing || '');
    const [warranty, setWarranty] = useState(initialData?.warranty || '');
    const [features, setFeatures] = useState<string[]>(
        Array.isArray(initialData?.features) ? initialData.features : []
    );

    // 3. Customer Tabs & Sizing
    const [dimensions, setDimensions] = useState(initialData?.dimensions || '');
    const [materialsCare, setMaterialsCare] = useState(initialData?.materialsCare || '');
    const [shippingDelivery, setShippingDelivery] = useState(initialData?.shippingDelivery || '');
    const [colors, setColors] = useState<string[]>(
        Array.isArray(initialData?.colors) ? initialData.colors : []
    );
    const [newColorInput, setNewColorInput] = useState('');
    const [allowCustomSize, setAllowCustomSize] = useState<boolean>(
        initialData ? Boolean(initialData.allowCustomSize) : false
    );
    const [customSizeNote, setCustomSizeNote] = useState(initialData?.customSizeNote || '');

    // 4. Media
    const [images, setImages] = useState<string[]>(initialData?.images || []);

    // 5. Visibility & Pricing
    const [isActive, setIsActive] = useState<boolean>(initialData ? Boolean(initialData.isActive) : true);
    const [isNegotiable, setIsNegotiable] = useState(initialData?.isNegotiable || false);
    const [variants, setVariants] = useState<Variant[]>(
        initialData?.variants?.map((v: any) => ({
            id: v.id,
            sizeId: v.sizeId,
            price: v.price.toString(),
            promoPrice: v.promoPrice?.toString() || '',
            stock: v.stock.toString(),
            sku: v.sku || ''
        })) || [{ sizeId: sizes?.[0]?.id || '', price: '', promoPrice: '', stock: '10' }]
    );

    // Variants Helpers
    const addVariant = () => {
        const unusedSize = sizes.find((s) => !variants.some((v) => v.sizeId === s.id));
        setVariants([...variants, { sizeId: unusedSize ? unusedSize.id : '', price: '', promoPrice: '', stock: '10' }]);
    };

    const removeVariant = (index: number) => {
        if (variants.length <= 1) {
            toast.error('Product must have at least 1 size variant');
            return;
        }
        setVariants(variants.filter((_, i) => i !== index));
    };

    const updateVariant = (index: number, field: string, value: string) => {
        const newVariants = [...variants];
        (newVariants[index] as any)[field] = value;
        setVariants(newVariants);
    };

    // Features Helpers
    const addFeature = () => setFeatures([...features, '']);
    const updateFeature = (index: number, value: string) => {
        const newFeatures = [...features];
        newFeatures[index] = value;
        setFeatures(newFeatures);
    };
    const removeFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index));

    // Colors Helpers
    const handleAddColor = (colorName: string) => {
        const trimmed = colorName.trim();
        if (!trimmed) return;
        if (colors.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
            toast.error('Color already added');
            return;
        }
        setColors([...colors, trimmed]);
        setNewColorInput('');
    };

    const handleRemoveColor = (colorName: string) => {
        setColors(colors.filter(c => c !== colorName));
    };

    // Submit handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return toast.error('Please enter a product name');
        if (!brandId) return toast.error('Please select a brand');
        if (variants.length === 0 || variants.some(v => !v.sizeId || !v.price)) {
            return toast.error('Please specify a size and price for all variants');
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name.trim());
            formData.append('description', description.trim());
            formData.append('brandId', brandId);
            formData.append('type', type);
            formData.append('materials', materials.trim());
            formData.append('firmness', firmness);
            formData.append('finishing', finishing.trim());
            formData.append('warranty', warranty.trim());
            formData.append('isNegotiable', isNegotiable.toString());
            formData.append('isActive', isActive.toString());

            formData.append('dimensions', dimensions.trim());
            formData.append('materialsCare', materialsCare.trim());
            formData.append('shippingDelivery', shippingDelivery.trim());
            formData.append('colors', JSON.stringify(colors));
            formData.append('allowCustomSize', allowCustomSize.toString());
            formData.append('customSizeNote', customSizeNote.trim());

            formData.append('features', JSON.stringify(features.filter(f => f.trim())));
            formData.append('images', JSON.stringify(images));
            formData.append('categoryIds', JSON.stringify(selectedCategoryIds));
            formData.append('variants', JSON.stringify(variants));

            const result = initialData
                ? await updateProduct(initialData.id, formData)
                : await createProduct(formData);

            if (result.success) {
                toast.success(initialData ? 'Product updated successfully!' : 'Product created successfully!');
                router.push('/account/products');
            } else {
                toast.error(result.error || 'Failed to save product');
            }
        } catch (error) {
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 font-sans max-w-6xl mx-auto pb-20">

            {/* ── 1. Clean Top Bar with Action ── */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <Link
                        href="/account/products"
                        className="p-2 text-stone-400 hover:text-blue-950 hover:bg-stone-100 rounded-xl transition-colors"
                        title="Back to Products"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                                {initialData ? 'Edit Product' : 'New Product'}
                            </span>
                            <span className={`text-[11px] font-semibold flex items-center gap-1 ${isActive ? 'text-emerald-700' : 'text-stone-400'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                                {isActive ? 'Live in Store' : 'Draft'}
                            </span>
                        </div>
                        <h1 className="text-lg sm:text-xl font-bold text-stone-900 mt-0.5 truncate max-w-md">
                            {name || 'Untitled Product'}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                    <Link
                        href="/account/products"
                        className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-950 hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-[0.98] disabled:opacity-60"
                    >
                        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        <span>{initialData ? 'Save Changes' : 'Create Product'}</span>
                    </button>
                </div>
            </div>

            {/* ── 2. Quick Jump Navigation Bar ── */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs no-scrollbar">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 shrink-0 mr-1">Jump to:</span>
                {[
                    { id: 'info', label: '1. Basic Info', icon: FileText },
                    { id: 'variants', label: '2. Sizes & Pricing', icon: Package },
                    { id: 'colors', label: '3. Colors & Sizing', icon: Palette },
                    { id: 'tabs', label: '4. Storefront Tabs & Specs', icon: Ruler },
                    { id: 'media', label: '5. Photos', icon: Layers },
                ].map((sec) => (
                    <button
                        key={sec.id}
                        type="button"
                        onClick={() => {
                            setActiveSection(sec.id as any);
                            const el = document.getElementById(`section-${sec.id}`);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors border ${
                            activeSection === sec.id
                                ? 'bg-blue-950 text-white border-blue-950 shadow-sm'
                                : 'bg-white hover:bg-stone-50 text-stone-600 border-stone-200/80'
                        }`}
                    >
                        <sec.icon className="w-3 h-3" />
                        <span>{sec.label}</span>
                    </button>
                ))}
            </div>

            {/* ── 3. Main Form Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Column (Main Specifications & Details) */}
                <div className="lg:col-span-8 space-y-8">

                    {/* ── SECTION 1: Basic Information ── */}
                    <div id="section-info" className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                            <div>
                                <h2 className="text-base font-bold text-stone-900">General Information</h2>
                                <p className="text-xs text-stone-500 mt-0.5">Product title, brand, categories, and customer narrative</p>
                            </div>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-600">Step 1</span>
                        </div>

                        {/* Title */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-700 block">
                                Product Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Mouka Regina Orthopedic Mattress"
                                className="w-full px-4 py-2.5 bg-stone-50/70 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-blue-950 focus:ring-2 focus:ring-blue-950/5 rounded-xl text-sm font-medium text-stone-900 outline-none transition-all"
                            />
                        </div>

                        {/* Brand & Categories in 2 Columns */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Brand Select */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-stone-700 block">
                                    Brand <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    required
                                    value={brandId}
                                    onChange={(e) => setBrandId(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-stone-50/70 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-blue-950 focus:ring-2 focus:ring-blue-950/5 rounded-xl text-xs font-medium text-stone-900 outline-none transition-all cursor-pointer"
                                >
                                    <option value="">Select Manufacturer / Brand…</option>
                                    {brands.map((b) => (
                                        <option key={b.id} value={b.id}>
                                            {b.name}
                                        </option>
                                    ))}
                                </select>
                                {brands.length === 0 && (
                                    <Link href="/account/brands/create" className="text-[11px] text-sky-700 hover:underline block mt-1">
                                        + Create Brand first
                                    </Link>
                                )}
                            </div>

                            {/* Product Type */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-stone-700 block">
                                    Product Type
                                </label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-stone-50/70 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-blue-950 focus:ring-2 focus:ring-blue-950/5 rounded-xl text-xs font-medium text-stone-900 outline-none transition-all cursor-pointer"
                                >
                                    <option value="">Select Product Type…</option>
                                    <option value="Mattress">Mattress</option>
                                    <option value="Pillow">Pillow / Cushion</option>
                                    <option value="Bed Frame">Bed Frame / Furniture</option>
                                    <option value="Bedding">Bedding / Bed Sheets</option>
                                    <option value="Accessory">Accessory / Decor</option>
                                </select>
                            </div>
                        </div>

                        {/* Category Badges Selector */}
                        <div className="space-y-2 pt-1">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-stone-700 block">
                                    Categories ({selectedCategoryIds.length} selected)
                                </label>
                                <span className="text-[11px] text-stone-400">Click to select/unselect</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((c) => {
                                    const isSelected = selectedCategoryIds.includes(c.id);
                                    return (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => {
                                                if (isSelected) {
                                                    setSelectedCategoryIds(selectedCategoryIds.filter((id) => id !== c.id));
                                                } else {
                                                    setSelectedCategoryIds([...selectedCategoryIds, c.id]);
                                                }
                                            }}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                                                isSelected
                                                    ? 'bg-blue-950 text-white border-blue-950 shadow-sm'
                                                    : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200/80'
                                            }`}
                                        >
                                            {isSelected && <Check className="w-3 h-3 inline-block mr-1 text-white" />}
                                            {c.name}
                                        </button>
                                    );
                                })}
                                {categories.length === 0 && (
                                    <p className="text-xs text-stone-400 italic">
                                        No categories yet. <Link href="/account/categories" className="text-sky-700 underline">Add categories</Link>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5 pt-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-stone-700 block">
                                    Product Description
                                </label>
                                <span className="text-[11px] text-stone-400">Appears on product overview and Description tab</span>
                            </div>
                            <textarea
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the mattress feel, target sleepers (e.g. back/stomach sleepers), high-density support, and craft details..."
                                className="w-full px-4 py-3 bg-stone-50/70 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-blue-950 focus:ring-2 focus:ring-blue-950/5 rounded-xl text-xs sm:text-sm text-stone-900 outline-none transition-all resize-y"
                            />
                        </div>
                    </div>

                    {/* ── SECTION 2: Sizes, Pricing & Inventory (Variants) ── */}
                    <div id="section-variants" className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                            <div>
                                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-sky-700" />
                                    <span>Sizes, Pricing &amp; Stock</span>
                                </h2>
                                <p className="text-xs text-stone-500 mt-0.5">Define each available mattress size with price, promo discount and stock</p>
                            </div>
                            <button
                                type="button"
                                onClick={addVariant}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-xl text-xs font-semibold transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add Size</span>
                            </button>
                        </div>

                        {/* Variants Table */}
                        <div className="space-y-3">
                            {variants.map((v, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 rounded-xl border border-stone-200/80 bg-stone-50/40 hover:bg-stone-50 transition-colors grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                                >
                                    {/* Size Selector */}
                                    <div className="sm:col-span-4 space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                                            Size / Dimension
                                        </label>
                                        <select
                                            value={v.sizeId}
                                            onChange={(e) => updateVariant(idx, 'sizeId', e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-stone-200 focus:border-blue-950 rounded-lg text-xs font-medium text-stone-900 outline-none"
                                        >
                                            <option value="">Select Size…</option>
                                            {sizes.map((s) => (
                                                <option key={s.id} value={s.id}>
                                                    {s.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Base Price */}
                                    <div className="sm:col-span-3 space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                                            Regular Price (₦)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400">₦</span>
                                            <input
                                                type="number"
                                                min="0"
                                                step="100"
                                                required
                                                value={v.price}
                                                onChange={(e) => updateVariant(idx, 'price', e.target.value)}
                                                placeholder="250000"
                                                className="w-full pl-6 pr-3 py-2 bg-white border border-stone-200 focus:border-blue-950 rounded-lg text-xs font-bold text-stone-900 outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Promo Price */}
                                    <div className="sm:col-span-3 space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                                            Sale Price (Optional)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400">₦</span>
                                            <input
                                                type="number"
                                                min="0"
                                                step="100"
                                                value={v.promoPrice}
                                                onChange={(e) => updateVariant(idx, 'promoPrice', e.target.value)}
                                                placeholder="e.g. 210000"
                                                className="w-full pl-6 pr-3 py-2 bg-white border border-stone-200 focus:border-blue-950 rounded-lg text-xs font-bold text-rose-600 placeholder:text-stone-300 outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Stock & Delete */}
                                    <div className="sm:col-span-2 flex items-end gap-2">
                                        <div className="flex-1 space-y-1">
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                                                Stock
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={v.stock}
                                                onChange={(e) => updateVariant(idx, 'stock', e.target.value)}
                                                className="w-full px-2.5 py-2 bg-white border border-stone-200 focus:border-blue-950 rounded-lg text-xs font-semibold text-stone-900 outline-none text-center"
                                            />
                                        </div>
                                        {variants.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeVariant(idx)}
                                                title="Remove this size"
                                                className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {sizes.length === 0 && (
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between">
                                <span>No sizes exist in the system yet.</span>
                                <Link href="/account/sizes" className="font-semibold underline ml-2">
                                    + Add Standard Sizes
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* ── SECTION 3: Colors & Custom Sizing ── */}
                    <div id="section-colors" className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                            <div>
                                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                                    <Palette className="w-4 h-4 text-amber-600" />
                                    <span>Available Colors &amp; Swatches</span>
                                </h2>
                                <p className="text-xs text-stone-500 mt-0.5">Colors appear as interactive clickable swatches on the customer product page</p>
                            </div>
                        </div>

                        {/* Current Color Badges */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-stone-700 block">
                                Active Color Options ({colors.length})
                            </label>
                            <div className="flex flex-wrap gap-2 min-h-[38px] p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                                {colors.map((c) => (
                                    <div
                                        key={c}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-medium text-stone-800 shadow-xs"
                                    >
                                        <span
                                            className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                                            style={{ backgroundColor: getSwatchHex(c) }}
                                        />
                                        <span>{c}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveColor(c)}
                                            className="text-stone-400 hover:text-rose-600 transition-colors ml-0.5"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                {colors.length === 0 && (
                                    <span className="text-xs text-stone-400 italic">No color variants added (swatches will be hidden on product page).</span>
                                )}
                            </div>
                        </div>

                        {/* Quick Add Presets & Custom Input */}
                        <div className="space-y-3 pt-1">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold text-stone-600">Popular Bedding &amp; Fabric Colors (Click to add):</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {COLOR_PRESETS.map((p) => {
                                    const isAdded = colors.includes(p.name);
                                    return (
                                        <button
                                            key={p.name}
                                            type="button"
                                            onClick={() => (isAdded ? handleRemoveColor(p.name) : handleAddColor(p.name))}
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                                                isAdded
                                                    ? 'bg-blue-950 text-white border-blue-950'
                                                    : 'bg-white hover:bg-stone-50 text-stone-600 border-stone-200'
                                            }`}
                                        >
                                            <span
                                                className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                                                style={{ backgroundColor: p.hex }}
                                            />
                                            <span>{p.name}</span>
                                            {isAdded && <Check className="w-3 h-3 text-white ml-0.5" />}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Custom Color Input */}
                            <div className="flex gap-2 pt-2">
                                <input
                                    type="text"
                                    value={newColorInput}
                                    onChange={(e) => setNewColorInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddColor(newColorInput);
                                        }
                                    }}
                                    placeholder="Or type custom color (e.g. Royal Navy, Pearl Grey)..."
                                    className="flex-1 px-3.5 py-2 bg-stone-50 focus:bg-white border border-stone-200 focus:border-blue-950 rounded-xl text-xs text-stone-900 outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleAddColor(newColorInput)}
                                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors"
                                >
                                    + Add
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── SECTION 4: Storefront Tabs (Dimensions, Materials, Shipping) ── */}
                    <div id="section-tabs" className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                            <div>
                                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                                    <Ruler className="w-4 h-4 text-indigo-700" />
                                    <span>Storefront Specification Tabs</span>
                                </h2>
                                <p className="text-xs text-stone-500 mt-0.5">Content displayed in the tabs below the product image. Leave blank to use store default text.</p>
                            </div>
                        </div>

                        {/* Dimensions Tab Field */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-stone-700 block">
                                    Dimensions Tab Writeup
                                </label>
                                <span className="text-[10px] text-stone-400 font-medium">Leave blank for default</span>
                            </div>
                            <textarea
                                rows={3}
                                value={dimensions}
                                onChange={(e) => setDimensions(e.target.value)}
                                placeholder="Sizes available: 3x6, 4x6, 5x6 and 6x6 feet. Height/Thickness: 10-12 inches. Please leave 60cm clearance around the bed frame."
                                className="w-full px-4 py-2.5 bg-stone-50/70 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-blue-950 rounded-xl text-xs text-stone-900 outline-none transition-all resize-y"
                            />
                        </div>

                        {/* Materials & Care Tab Field */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-stone-700 block">
                                    Materials &amp; Care Guide Tab Writeup
                                </label>
                                <span className="text-[10px] text-stone-400 font-medium">Leave blank for default</span>
                            </div>
                            <textarea
                                rows={3}
                                value={materialsCare}
                                onChange={(e) => setMaterialsCare(e.target.value)}
                                placeholder="High-density orthopedic rebonded foam wrapped in luxury quilted Damascus fabric. Rotate your mattress head-to-toe every 3–6 months for maximum lifespan. Spot clean with mild soap."
                                className="w-full px-4 py-2.5 bg-stone-50/70 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-blue-950 rounded-xl text-xs text-stone-900 outline-none transition-all resize-y"
                            />
                        </div>

                        {/* Shipping & Delivery Tab Field */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-stone-700 block">
                                    Shipping &amp; Delivery Tab Writeup
                                </label>
                                <span className="text-[10px] text-stone-400 font-medium">Leave blank for default</span>
                            </div>
                            <textarea
                                rows={3}
                                value={shippingDelivery}
                                onChange={(e) => setShippingDelivery(e.target.value)}
                                placeholder="Delivered factory-sealed in heavy-duty protective polythene. Free delivery within Abuja and Benin City within 24–48 hours. White-glove installation available upon request."
                                className="w-full px-4 py-2.5 bg-stone-50/70 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-blue-950 rounded-xl text-xs text-stone-900 outline-none transition-all resize-y"
                            />
                        </div>

                        {/* Technical Attributes Grid */}
                        <div className="pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-stone-700 block">Firmness Level</label>
                                <select
                                    value={firmness}
                                    onChange={(e) => setFirmness(e.target.value)}
                                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 focus:border-blue-950 rounded-lg text-xs font-medium text-stone-900 outline-none"
                                >
                                    <option value="">None / Not Applicable</option>
                                    <option value="Plush Soft">Plush Soft</option>
                                    <option value="Standard Medium">Standard Medium</option>
                                    <option value="Medium Firm">Medium Firm</option>
                                    <option value="Superior Hard">Superior Hard</option>
                                    <option value="Orthopedic Support">Orthopedic Support</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-stone-700 block">Warranty Commitment</label>
                                <input
                                    type="text"
                                    value={warranty}
                                    onChange={(e) => setWarranty(e.target.value)}
                                    placeholder="e.g. 10-Year Factory Warranty"
                                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 focus:border-blue-950 rounded-lg text-xs font-medium text-stone-900 outline-none"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-stone-700 block">Cover / Finishing</label>
                                <input
                                    type="text"
                                    value={finishing}
                                    onChange={(e) => setFinishing(e.target.value)}
                                    placeholder="e.g. Quilted Damascus Jacquard"
                                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 focus:border-blue-950 rounded-lg text-xs font-medium text-stone-900 outline-none"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-stone-700 block">Core Materials</label>
                                <input
                                    type="text"
                                    value={materials}
                                    onChange={(e) => setMaterials(e.target.value)}
                                    placeholder="e.g. High-density rebonded foam"
                                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 focus:border-blue-950 rounded-lg text-xs font-medium text-stone-900 outline-none"
                                />
                            </div>
                        </div>

                        {/* Distinctive Features Bullets */}
                        <div className="pt-4 border-t border-stone-100 space-y-2.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-stone-700 block">Key Features Checklist (Bullet Points)</label>
                                <button
                                    type="button"
                                    onClick={addFeature}
                                    className="text-xs font-semibold text-sky-700 hover:text-blue-950 transition-colors"
                                >
                                    + Add Feature
                                </button>
                            </div>
                            {features.length === 0 && (
                                <p className="text-xs text-stone-400 italic py-1">
                                    No custom bullet features added yet. Click &quot;+ Add Feature&quot; to highlight selling points (e.g. 100% Original Brand Guarantee, 7-Day Replacement).
                                </p>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {features.map((f, i) => (
                                    <div key={i} className="relative flex items-center">
                                        <input
                                            type="text"
                                            value={f}
                                            onChange={(e) => updateFeature(i, e.target.value)}
                                            placeholder="e.g. Anti-dust mite cover"
                                            className="w-full pl-3 pr-8 py-2 bg-stone-50 border border-stone-200 focus:border-blue-950 rounded-lg text-xs font-medium text-stone-900 outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(i)}
                                            className="absolute right-2 text-stone-400 hover:text-rose-500"
                                            title="Remove feature"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column (Media & Settings) */}
                <div className="lg:col-span-4 space-y-6">

                    {/* ── SECTION 5: Photos & Media ── */}
                    <div id="section-media" className="bg-white rounded-2xl border border-stone-200/90 p-6 space-y-4 shadow-sm">
                        <div className="border-b border-stone-100 pb-3">
                            <h2 className="text-sm font-bold text-stone-900">Product Photography</h2>
                            <p className="text-[11px] text-stone-500">First image will be the primary catalog thumbnail</p>
                        </div>

                        <CloudinaryUpload
                            value={images}
                            onChange={setImages}
                            maxFiles={6}
                            label="Upload Photos"
                        />
                    </div>

                    {/* ── Publishing Controls & Settings ── */}
                    <div className="bg-white rounded-2xl border border-stone-200/90 p-6 space-y-5 shadow-sm">
                        <div className="border-b border-stone-100 pb-3">
                            <h2 className="text-sm font-bold text-stone-900">Publishing &amp; Features</h2>
                            <p className="text-[11px] text-stone-500">Visibility, WhatsApp negotiation, and custom sizing</p>
                        </div>

                        {/* Visibility Toggle */}
                        <div
                            onClick={() => setIsActive(!isActive)}
                            className="flex items-center justify-between p-3 rounded-xl bg-stone-50/80 hover:bg-stone-50 border border-stone-200/70 cursor-pointer transition-colors"
                        >
                            <div>
                                <span className="text-xs font-bold text-stone-900 block">Product Visibility</span>
                                <span className={`text-[11px] font-semibold ${isActive ? 'text-emerald-700' : 'text-stone-400'}`}>
                                    {isActive ? 'Live — visible to buyers' : 'Draft — hidden from store'}
                                </span>
                            </div>
                            <div className={`w-11 h-6 rounded-full transition-all relative ${isActive ? 'bg-emerald-600' : 'bg-stone-300'}`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${isActive ? 'left-6' : 'left-1'}`} />
                            </div>
                        </div>

                        {/* Custom Sizing Toggle */}
                        <div
                            onClick={() => setAllowCustomSize(!allowCustomSize)}
                            className="flex items-center justify-between p-3 rounded-xl bg-stone-50/80 hover:bg-stone-50 border border-stone-200/70 cursor-pointer transition-colors"
                        >
                            <div>
                                <span className="text-xs font-bold text-stone-900 block">Custom Size Inquiries</span>
                                <span className="text-[11px] text-stone-500 block">
                                    {allowCustomSize ? 'Show "Custom size" button' : 'Hidden on product page'}
                                </span>
                            </div>
                            <div className={`w-11 h-6 rounded-full transition-all relative ${allowCustomSize ? 'bg-blue-950' : 'bg-stone-300'}`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${allowCustomSize ? 'left-6' : 'left-1'}`} />
                            </div>
                        </div>

                        {allowCustomSize && (
                            <div className="space-y-1 pl-1">
                                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Custom Sizing Note (Optional)</label>
                                <input
                                    type="text"
                                    value={customSizeNote}
                                    onChange={(e) => setCustomSizeNote(e.target.value)}
                                    placeholder="e.g. 3-5 days lead time directly from factory"
                                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 outline-none"
                                />
                            </div>
                        )}

                        {/* WhatsApp Price Negotiation Toggle */}
                        <div
                            onClick={() => setIsNegotiable(!isNegotiable)}
                            className="flex items-center justify-between p-3 rounded-xl bg-stone-50/80 hover:bg-stone-50 border border-stone-200/70 cursor-pointer transition-colors"
                        >
                            <div>
                                <span className="text-xs font-bold text-stone-900 block">Negotiate on WhatsApp</span>
                                <span className="text-[11px] text-stone-500 block">Allow customer price bargaining</span>
                            </div>
                            <div className={`w-11 h-6 rounded-full transition-all relative ${isNegotiable ? 'bg-emerald-600' : 'bg-stone-300'}`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${isNegotiable ? 'left-6' : 'left-1'}`} />
                            </div>
                        </div>

                        {/* Summary Stats */}
                        <div className="p-3 bg-stone-50 rounded-xl space-y-1.5 text-xs text-stone-600 border border-stone-200/50">
                            <div className="flex justify-between">
                                <span>Sizes Linked:</span>
                                <span className="font-semibold text-stone-900">{variants.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Colors Configured:</span>
                                <span className="font-semibold text-stone-900">{colors.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Images Uploaded:</span>
                                <span className="font-semibold text-stone-900">{images.length}</span>
                            </div>
                        </div>

                        {/* Primary Save Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-950 hover:bg-blue-900 text-white py-3.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span>{initialData ? 'Save Product Changes' : 'Publish Product'}</span>
                        </button>
                    </div>

                </div>

            </div>

        </form>
    );
}
