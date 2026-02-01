'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Save,
    Loader2,
    Settings,
    CreditCard,
    Tag,
    Info,
    Plus,
    X,
    Package
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct } from '@/actions/products';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import { toast } from 'react-hot-toast';

interface ProductFormProps {
    brands: any[];
    categories: any[];
    sizes: any[];
    initialData?: any;
}

interface Variant {
    sizeId: string;
    price: string;
    promoPrice: string;
    stock: string;
    sku?: string; // Optional as it might be used later
}

export default function ProductForm({ brands, categories, sizes, initialData }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Core Identity
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [brandId, setBrandId] = useState(initialData?.brandId || '');
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
        initialData?.categories?.map((c: any) => c.categoryId) || []
    );

    // Elite Attributes
    const [type, setType] = useState(initialData?.type || 'Mattress');
    const [materials, setMaterials] = useState(initialData?.materials || '');
    const [firmness, setFirmness] = useState(initialData?.firmness || 'Standard Medium');
    const [finishing, setFinishing] = useState(initialData?.finishing || '');
    const [warranty, setWarranty] = useState(initialData?.warranty || '');
    const [features, setFeatures] = useState<string[]>(initialData?.features || ['']);

    // Media
    const [images, setImages] = useState<string[]>(initialData?.images || []);

    // Financials & Variants
    const [isNegotiable, setIsNegotiable] = useState(initialData?.isNegotiable || false);
    const [variants, setVariants] = useState<Variant[]>(
        initialData?.variants?.map((v: any) => ({
            sizeId: v.sizeId,
            price: v.price.toString(),
            promoPrice: v.promoPrice?.toString() || '',
            stock: v.stock.toString()
        })) || [{ sizeId: '', price: '', promoPrice: '', stock: '10' }]
    );

    const addVariant = () => {
        setVariants([...variants, { sizeId: '', price: '', promoPrice: '', stock: '10' }]);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const updateVariant = (index: number, field: string, value: string) => {
        const newVariants = [...variants];
        (newVariants[index] as any)[field] = value;
        setVariants(newVariants);
    };

    const addFeature = () => setFeatures([...features, '']);
    const updateFeature = (index: number, value: string) => {
        const newFeatures = [...features];
        newFeatures[index] = value;
        setFeatures(newFeatures);
    };
    const removeFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!brandId) return toast.error('Please select a brand');
        if (variants.some(v => !v.sizeId || !v.price)) return toast.error('Please complete all variant details');

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('brandId', brandId);
            formData.append('type', type);
            formData.append('materials', materials);
            formData.append('firmness', firmness);
            formData.append('finishing', finishing);
            formData.append('warranty', warranty);
            formData.append('isNegotiable', isNegotiable.toString());

            formData.append('features', JSON.stringify(features.filter(f => f.trim())));
            formData.append('images', JSON.stringify(images));
            formData.append('categoryIds', JSON.stringify(selectedCategoryIds));
            formData.append('variants', JSON.stringify(variants));

            const result = initialData
                ? await updateProduct(initialData.id, formData)
                : await createProduct(formData);

            if (result.success) {
                toast.success(initialData ? 'Product updated successfully' : 'Product established successfully');
                router.push('/account/products');
            } else {
                toast.error(result.error || 'Operation failed');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 font-sans">
            {/* Left Column: Core Data */}
            <div className="lg:col-span-8 space-y-12">

                {/* Basic Identity Section */}
                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-slate-100 dark:border-gray-700 p-10 shadow-xl shadow-blue-950/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Tag className="w-24 h-24" />
                    </div>

                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-10 h-10 bg-sky-50 dark:bg-sky-900/20 rounded-xl flex items-center justify-center text-sky-600">
                            <Info className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-black text-blue-950 dark:text-white uppercase tracking-tight">Identity Details</h2>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Product Nomenclature</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-gray-900 border-2 border-transparent focus:border-sky-600 focus:bg-white rounded-2xl px-6 py-4 text-sm font-bold text-blue-950 dark:text-white outline-none transition-all"
                                placeholder="e.g. Vitafoam Grandeur Orthopedic"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Brand Origin</label>
                                <select
                                    required
                                    value={brandId}
                                    onChange={(e) => setBrandId(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-gray-900 border-2 border-transparent focus:border-sky-600 focus:bg-white rounded-2xl px-6 py-4 text-sm font-bold text-blue-950 dark:text-white outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">{brands.length === 0 ? 'No Brands Found' : 'Select Brand...'}</option>
                                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                                {brands.length === 0 && (
                                    <Link
                                        href="/account/brands/create"
                                        className="text-[9px] font-black text-sky-600 uppercase tracking-widest mt-2 block hover:underline"
                                    >
                                        + Establish Brand Identity First
                                    </Link>
                                )}
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Primary Category</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {categories.map(c => (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => {
                                                if (selectedCategoryIds.includes(c.id)) {
                                                    setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== c.id));
                                                } else {
                                                    setSelectedCategoryIds([...selectedCategoryIds, c.id]);
                                                }
                                            }}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedCategoryIds.includes(c.id)
                                                ? 'bg-blue-950 text-white border-blue-950'
                                                : 'bg-slate-50 text-slate-400 border-slate-100'
                                                }`}
                                        >
                                            {c.name}
                                        </button>
                                    ))}
                                    {categories.length === 0 && (
                                        <div className="col-span-2 py-4 border-2 border-dashed border-slate-100 rounded-xl text-center">
                                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-2">No Categories Defined</p>
                                            <Link
                                                href="/account/categories"
                                                className="text-[9px] font-black text-sky-600 uppercase tracking-widest hover:underline"
                                            >
                                                + Create Categories
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Editorial Narrative</label>
                            <textarea
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-gray-900 border-2 border-transparent focus:border-sky-600 focus:bg-white rounded-2xl px-6 py-4 text-sm font-medium text-blue-950 dark:text-white outline-none transition-all resize-none"
                                placeholder="Describe the essence of this elite comfort..."
                            />
                        </div>
                    </div>
                </div>

                {/* Variants Control Section */}
                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-slate-100 dark:border-gray-700 p-10 shadow-xl shadow-blue-950/5">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600">
                                <Package className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-black text-blue-950 dark:text-white uppercase tracking-tight">Technical Variants</h2>
                        </div>
                        <button
                            type="button"
                            onClick={addVariant}
                            className="bg-slate-50 hover:bg-sky-50 dark:bg-gray-700 dark:hover:bg-sky-900/20 text-slate-400 hover:text-sky-600 px-6 py-3 rounded-xl border border-dashed border-slate-200 dark:border-gray-600 transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Add Size Standard
                        </button>
                    </div>

                    <div className="space-y-4">
                        {variants.map((v, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-slate-50/50 dark:bg-gray-900/50 rounded-3xl relative group border border-slate-50 dark:border-gray-700">
                                {variants.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeVariant(index)}
                                        className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 border-2 border-slate-100 dark:border-gray-700 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 transition-all shadow-md opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Dimensions</label>
                                    <select
                                        value={v.sizeId}
                                        onChange={(e) => updateVariant(index, 'sizeId', e.target.value)}
                                        className="w-full bg-white dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-sm font-bold text-blue-950 dark:text-white outline-none focus:ring-2 focus:ring-sky-600 appearance-none cursor-pointer"
                                    >
                                        <option value="">{sizes.length === 0 ? 'No Sizes Found' : 'Select Size...'}</option>
                                        {sizes.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                                    </select>
                                    {sizes.length === 0 && (
                                        <Link
                                            href="/account/sizes"
                                            className="text-[9px] font-black text-sky-600 uppercase tracking-widest mt-1 block hover:underline"
                                        >
                                            + Define Sizes First
                                        </Link>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Listing Price</label>
                                    <input
                                        type="number"
                                        value={v.price}
                                        onChange={(e) => updateVariant(index, 'price', e.target.value)}
                                        className="w-full bg-white dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-sm font-bold text-blue-950 dark:text-white outline-none focus:ring-2 focus:ring-sky-600 font-sans"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Promo Price</label>
                                    <input
                                        type="number"
                                        value={v.promoPrice}
                                        onChange={(e) => updateVariant(index, 'promoPrice', e.target.value)}
                                        className="w-full bg-white dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-sm font-bold text-blue-950 dark:text-white outline-none focus:ring-2 focus:ring-sky-600 font-sans"
                                        placeholder="Optional"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Inventory Status</label>
                                    <input
                                        type="number"
                                        value={v.stock}
                                        onChange={(e) => updateVariant(index, 'stock', e.target.value)}
                                        className="w-full bg-white dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-sm font-bold text-blue-950 dark:text-white outline-none focus:ring-2 focus:ring-sky-600 font-sans"
                                        placeholder="10"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Attributes Section */}
                <div className="bg-slate-50 dark:bg-gray-900 rounded-[2.5rem] border border-slate-200/50 dark:border-gray-700/50 p-10 relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-10 h-10 bg-blue-950 rounded-xl flex items-center justify-center text-white">
                            <Settings className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-black text-blue-950 dark:text-white uppercase tracking-tight">Elite Attributes</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Composition Materials</label>
                            <input
                                type="text"
                                value={materials}
                                onChange={(e) => setMaterials(e.target.value)}
                                className="w-full bg-white dark:bg-gray-800 border-none rounded-2xl px-6 py-4 text-sm font-bold text-blue-950 dark:text-white outline-none shadow-sm focus:ring-4 focus:ring-sky-600/10"
                                placeholder="e.g. Memory Foam, Latex"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Firmness Protocol</label>
                            <select
                                value={firmness}
                                onChange={(e) => setFirmness(e.target.value)}
                                className="w-full bg-white dark:bg-gray-800 border-none rounded-2xl px-6 py-4 text-sm font-bold text-blue-950 dark:text-white outline-none shadow-sm focus:ring-4 focus:ring-sky-600/10 appearance-none cursor-pointer"
                            >
                                <option>Standard Medium</option>
                                <option>Plush Soft</option>
                                <option>Superior Hard</option>
                                <option>Orthopedic Support</option>
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Finishing Treatment</label>
                            <input
                                type="text"
                                value={finishing}
                                onChange={(e) => setFinishing(e.target.value)}
                                className="w-full bg-white dark:bg-gray-800 border-none rounded-2xl px-6 py-4 text-sm font-bold text-blue-950 dark:text-white outline-none shadow-sm focus:ring-4 focus:ring-sky-600/10"
                                placeholder="e.g. Damascus Fabric Quilting"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Warranty Commitment</label>
                            <input
                                type="text"
                                value={warranty}
                                onChange={(e) => setWarranty(e.target.value)}
                                className="w-full bg-white dark:bg-gray-800 border-none rounded-2xl px-6 py-4 text-sm font-bold text-blue-950 dark:text-white outline-none shadow-sm focus:ring-4 focus:ring-sky-600/10"
                                placeholder="e.g. 10 Years Manufacturer Warranty"
                            />
                        </div>
                    </div>

                    <div className="mt-10 space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Distinctive Features</label>
                            <button
                                type="button"
                                onClick={addFeature}
                                className="text-sky-600 text-[9px] font-black uppercase tracking-widest hover:text-blue-950 transition-colors"
                            >
                                + Add Feature
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {features.map((f, i) => (
                                <div key={i} className="relative">
                                    <input
                                        type="text"
                                        value={f}
                                        onChange={(e) => updateFeature(i, e.target.value)}
                                        className="w-full bg-white dark:bg-gray-800 border-none rounded-xl px-6 py-3 text-xs font-bold text-blue-950 dark:text-white outline-none shadow-sm"
                                        placeholder="e.g. Anti-Fungal Treatment"
                                    />
                                    {features.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(i)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Pricing & Media */}
            <div className="lg:col-span-4 space-y-12">

                {/* Media Module */}
                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-slate-100 dark:border-gray-700 p-8 shadow-xl shadow-blue-950/5">
                    <CloudinaryUpload
                        value={images}
                        onChange={setImages}
                        maxFiles={5}
                        label="Galleria Curations"
                    />
                </div>

                {/* Financial Summary */}
                <div className="bg-blue-950 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-950/20 sticky top-8">
                    <div className="flex items-center gap-4 mb-10">
                        <CreditCard className="w-6 h-6 text-sky-400" />
                        <h2 className="text-xl font-black uppercase tracking-tight">Strategy</h2>
                    </div>

                    <div className="space-y-8">
                        <div className="pt-4 flex items-center justify-between border-t border-white/10 group cursor-pointer" onClick={() => setIsNegotiable(!isNegotiable)}>
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">Negotiation Protocol</span>
                                <p className="text-[8px] font-bold text-sky-400 uppercase tracking-tight">Allow pricing dialogue</p>
                            </div>
                            <div className={`w-12 h-6 rounded-full transition-all relative ${isNegotiable ? 'bg-sky-600' : 'bg-blue-900'}`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-lg ${isNegotiable ? 'left-7' : 'left-1'}`} />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/10">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                                <span>Variants Linked</span>
                                <span>{variants.length} Standards</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                                <span>Media Assets</span>
                                <span>{images.length} Curations</span>
                            </div>
                        </div>

                        <div className="pt-8">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-sky-600 hover:bg-sky-500 text-white py-5 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl shadow-sky-600/20 active:scale-95 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {initialData ? 'Commit Updates' : 'Establish Product'}
                            </button>
                            <p className="text-[9px] text-center font-bold text-sky-400/60 uppercase tracking-widest mt-6 italic">Finalizes entry in global inventory</p>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
