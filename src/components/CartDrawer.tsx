'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { motion } from 'framer-motion'
import { XMarkIcon, ShoppingCartIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/lib/cart-context'
import Image from 'next/image'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { state, updateQuantity, removeFromCart } = useCart()
  const { items: cartItems } = state

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.variant?.promoPrice || item.variant?.price || 0
    return sum + (price * item.quantity)
  }, 0)

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/20 backdrop-blur-md transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex h-full flex-col overflow-y-scroll bg-white/95 backdrop-blur-lg shadow-xl"
                  >
                    {/* Header */}
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-sm font-black text-blue-950 uppercase tracking-[0.3em]">
                          Selection Dossier
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-slate-400 hover:text-blue-950 transition-colors"
                            onClick={onClose}
                          >
                            <XMarkIcon className="h-6 w-6" />
                          </button>
                        </div>
                      </div>

                      {/* Cart Items */}
                      <div className="mt-12">
                        <div className="flow-root">
                          {cartItems.length === 0 ? (
                            <div className="text-center py-20 px-4">
                              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShoppingCartIcon className="h-10 w-10 text-slate-200" />
                              </div>
                              <h3 className="text-sm font-black text-blue-950 uppercase tracking-widest mb-2 font-display">Your collection is empty</h3>
                              <p className="text-xs text-slate-400 font-medium font-inter">Begin curation by selecting our premium pieces.</p>
                            </div>
                          ) : (
                            <ul role="list" className="-my-6 divide-y divide-slate-100">
                              {cartItems.map((item) => (
                                <motion.li
                                  key={item.id}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="flex py-8 group"
                                >
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-50 relative border border-slate-100">
                                    <Image
                                      src={item.product?.images?.[0] || "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2070&auto=format&fit=crop"}
                                      alt={item.product?.name || 'Product'}
                                      fill
                                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                  </div>

                                  <div className="ml-6 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-[10px] font-black text-blue-950 uppercase tracking-widest leading-none mb-2">
                                        <h3 className="line-clamp-1">{item.product?.name}</h3>
                                        <p className="ml-4 tabular-nums">₦{((item.variant?.promoPrice || item.variant?.price || 0) * item.quantity).toLocaleString()}</p>
                                      </div>
                                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                        {item.variant?.size?.label || 'Standard'}
                                      </p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between">
                                      <div className="flex items-center space-x-4 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100/50">
                                        <button
                                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                          className="text-slate-400 hover:text-blue-950 transition-colors"
                                        >
                                          <MinusIcon className="h-3 w-3" />
                                        </button>
                                        <span className="text-xs font-black text-blue-950 w-4 text-center">{item.quantity}</span>
                                        <button
                                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                          className="text-slate-400 hover:text-blue-950 transition-colors"
                                        >
                                          <PlusIcon className="h-3 w-3" />
                                        </button>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-[10px] font-black text-sky-600 hover:text-sky-700 uppercase tracking-widest transition-colors"
                                      >
                                        Dismiss
                                      </button>
                                    </div>
                                  </div>
                                </motion.li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    {cartItems.length > 0 && (
                      <div className="border-t border-slate-100 px-8 py-10 sm:px-10 bg-slate-50/50">
                        <div className="flex justify-between items-baseline mb-2">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Acquisition Total</p>
                          <p className="text-2xl font-black text-blue-950 tabular-nums">₦{subtotal.toLocaleString()}</p>
                        </div>
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-10">
                          Logistics calculated at final verification.
                        </p>
                        <div className="">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              window.location.href = '/checkout'
                            }}
                            className="btn-elite w-full py-6"
                          >
                            Proceed to Checkpoint
                          </motion.button>
                        </div>
                        <div className="mt-8 flex justify-center text-center">
                          <button
                            type="button"
                            className="text-[9px] font-black text-slate-400 hover:text-blue-950 uppercase tracking-[0.3em] transition-all flex items-center gap-2 group"
                            onClick={onClose}
                          >
                            Resume Curation
                            <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform"> &rarr;</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
