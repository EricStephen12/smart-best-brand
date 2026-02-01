import React from 'react';
import StorySection from '@/components/StorySection';
import { Truck, ShieldCheck, Heart, Award } from 'lucide-react';
import { getAllBrands } from '@/actions/brands';

export default async function AboutPage() {
    const brandsResult = await getAllBrands();
    const brands = brandsResult.success ? brandsResult.data : [];

    return (
        <div className="pt-20 font-sans">
            {/* Hero Header */}
            <div className="bg-blue-950 py-20 sm:py-32 text-center relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <h1 className="text-6xl md:text-[8rem] font-black text-white mb-8 tracking-tighter leading-[0.85] uppercase">
                        Driven by <br /><span className="text-sky-600">Comfort.</span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed font-inter">
                        Nigeria&apos;s premier destination for authentic bedding and home essentials.
                        We bring the best brands directly to your doorstep with white-glove precision.
                    </p>
                </div>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-950" />
                </div>
            </div>

            <StorySection brandCount={brands?.length || 0} />

            {/* Values Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
                        <ValueCard
                            icon={ShieldCheck}
                            title="100% Authentic"
                            description="We only stock original products directly from authorized brand manufacturers."
                        />
                        <ValueCard
                            icon={Truck}
                            title="Reliable Delivery"
                            description="Specialized delivery services across Abuja and Benin, with more locations coming soon."
                        />
                        <ValueCard
                            icon={Award}
                            title="Full Warranty"
                            description="Every mattress and piece of furniture comes with a valid manufacturer's warranty."
                        />
                        <ValueCard
                            icon={Heart}
                            title="Customer First"
                            description="Our team is dedicated to helping you find the perfect fit for your home and budget."
                        />
                    </div>
                </div>
            </section>

            {/* Brands Grid */}
            {brands && brands.length > 0 && (
                <section className="py-32 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <h2 className="text-blue-950 font-black tracking-[0.4em] text-[10px] uppercase mb-20 opacity-40">Our Established Partner Brands</h2>
                        <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24 grayscale hover:grayscale-0 transition-all duration-[1.5s] ease-out">
                            {brands.map((brand: any) => (
                                <span key={brand.id} className="text-3xl md:text-4xl font-black text-blue-950/20 hover:text-sky-600/40 transition-colors cursor-default uppercase tracking-tighter">
                                    {brand.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

function ValueCard({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) {
    return (
        <div className="flex flex-col items-center text-center group">
            <div className="w-24 h-24 bg-slate-50 text-blue-950 rounded-[2.5rem] flex items-center justify-center mb-10 group-hover:bg-sky-600 group-hover:text-white transition-all duration-700 shadow-xl shadow-blue-950/5 group-hover:scale-110 border border-slate-100">
                <Icon className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-black text-blue-950 mb-4 uppercase tracking-tight">{title}</h4>
            <p className="text-slate-400 font-medium leading-relaxed font-inter">{description}</p>
        </div>
    );
}
