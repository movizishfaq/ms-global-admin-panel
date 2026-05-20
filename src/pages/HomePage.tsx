import React, { useEffect, useState, useRef, Children, Fragment, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Marquee } from '../components/Marquee';
import { useCart } from '../App';
import { StudioSelectBar } from '../components/studio/StudioSelectBar';
import { useVisitorSite } from '../hooks/useVisitorSite';
import { useStore } from '../context/StoreContext';
import {
  activeCatalogProducts,
  catalogToHomeCard,
  type HomeProductCard
} from '../lib/catalogDisplay';
import {
  sortedVisibleHomeSections,
  type HomeSectionId
} from '../types/siteBuilder';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
  Zap,
  Sparkles,
  Droplets,
  Sun,
  Wind,
  Leaf,
  FlaskConical,
  Layers,
  Grid,
  SendIcon } from
'lucide-react';
import oip from './OIP.webp';
const HERO_IMAGE  = oip;
const CATEGORIES = [
{
  label: 'Face Oils',
  icon: Droplets
},
{
  label: 'Serums',
  icon: Sparkles
},
{
  label: 'Moisturizer',
  icon: Sun
},
{
  label: 'Toner',
  icon: Wind
},
{
  label: 'Body Oil',
  icon: Leaf
},
{
  label: 'Masks',
  icon: FlaskConical
},
{
  label: 'SPF',
  icon: Layers
},
{
  label: 'All',
  icon: Grid
}];

// ─── Review Types ─────────────────────────────────────────────────────────────
interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  time: string;
}
// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({
  value,
  onChange



}: {value: number;onChange?: (v: number) => void;}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) =>
      <button
        key={star}
        type="button"
        onClick={() => onChange?.(star)}
        onMouseEnter={() => onChange && setHovered(star)}
        onMouseLeave={() => onChange && setHovered(0)}
        className={onChange ? 'cursor-pointer' : 'cursor-default'}
        aria-label={`${star} star`}>

          <Star
          className="w-5 h-5 transition-colors"
          style={{
            fill: star <= (hovered || value) ? '#FBBF24' : 'transparent',
            color:
            star <= (hovered || value) ?
            '#FBBF24' :
            'rgba(255,255,255,0.3)'
          }} />

        </button>
      )}
    </div>);

}
// ─── Reviews Section ──────────────────────────────────────────────────────────
function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    const newReview: Review = {
      id: `r${Date.now()}`,
      name: name.trim(),
      rating,
      comment: comment.trim(),
      time: 'Just now'
    };
    setReviews((prev) => [newReview, ...prev]);
    setName('');
    setComment('');
    setRating(5);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };
  return (
    <section
      className="relative py-12 px-6 border-t border-white/10"
      style={{
        backgroundColor: 'var(--primary)'
      }}>

      <StudioSelectBar panel="sections" label="Reviews" block="reviews" />
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-10">
          <p className="font-mono text-xs text-white/50 uppercase tracking-[0.3em] mb-2">
            What Our Customers Say
          </p>
          <h2 className="font-anton text-4xl md:text-5xl text-white uppercase">
            CUSTOMER REVIEWS
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form */}
          <div
            className="rounded-2xl p-6 border border-white/10 h-fit"
            style={{
              backgroundColor: 'rgba(255,255,255,0.08)'
            }}>

            <h3 className="font-anton text-xl text-white uppercase mb-5">
              LEAVE A REVIEW
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-white/60 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="YOUR NAME"
                  required
                  className="w-full font-mono text-sm border-2 px-4 py-3 focus:outline-none transition-colors placeholder:text-white/30 rounded-lg text-white"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderColor: 'rgba(255,255,255,0.2)'
                  }} />

              </div>
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-white/60 mb-2">
                  Star Rating
                </label>
                <StarRating value={rating} onChange={setRating} />
              </div>
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-white/60 mb-2">
                  Your Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="SHARE YOUR EXPERIENCE..."
                  required
                  rows={3}
                  className="w-full font-mono text-sm border-2 px-4 py-3 focus:outline-none transition-colors placeholder:text-white/30 rounded-lg text-white resize-none"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderColor: 'rgba(255,255,255,0.2)'
                  }} />

              </div>
              <motion.button
                type="submit"
                whileTap={{
                  scale: 0.99
                }}
                className="w-full font-mono text-sm uppercase tracking-widest text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: '#FF0000'
                }}>

                <SendIcon className="w-4 h-4" />
                SUBMIT REVIEW →
              </motion.button>
              <AnimatePresence>
                {submitted &&
                <motion.p
                  initial={{
                    opacity: 0,
                    y: -5
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  exit={{
                    opacity: 0
                  }}
                  className="font-mono text-xs text-green-400 text-center uppercase tracking-widest">

                    ✓ Review submitted! Thank you.
                  </motion.p>
                }
              </AnimatePresence>
            </form>
          </div>

          {/* Reviews List */}
          <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
            {reviews.length === 0 ? (
            <p className="font-mono text-xs text-white/40 text-center py-8 uppercase tracking-widest">
              No reviews yet — be the first to share your experience.
            </p>
            ) : null}
            <AnimatePresence initial={false}>
              {reviews.map((review, i) =>
              <motion.div
                key={review.id}
                initial={{
                  opacity: 0,
                  y: 20
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: i < 3 ? i * 0.06 : 0,
                  duration: 0.4
                }}
                className="rounded-xl p-4 border border-white/10"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)'
                }}>

                  <div className="flex items-start justify-between mb-2 gap-2">
                    <div className="flex items-center gap-3">
                      <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: '#FF0000'
                      }}>

                        <span className="font-mono text-xs text-white font-bold">
                          {review.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-mono text-xs text-white font-bold">
                          {review.name}
                        </p>
                        <p className="font-mono text-xs text-white/40">
                          {review.time}
                        </p>
                      </div>
                    </div>
                    <StarRating value={review.rating} />
                  </div>
                  <p className="font-mono text-sm text-white/70 leading-relaxed pl-12">
                    {review.comment}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>);

}
// ─── Product Cards ────────────────────────────────────────────────────────────
function FlashProductCard({
  product


}: {product: HomeProductCard}) {
  const [liked, setLiked] = useState(false);
  const { addToCart, cartItems } = useCart();
  const inCart = cartItems.some((i) => i.id === product.id);
  return (
    <div className="flex-shrink-0 w-44 bg-white border border-gray-100 rounded-lg overflow-hidden group shadow-sm">
      <div className="relative h-44 overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />

        <button
          onClick={() => setLiked((l) => !l)}
          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow">

          <Heart
            className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />

        </button>
        {product.original &&
        <div className="absolute top-2 left-2 bg-red-500 text-white font-mono text-xs px-1.5 py-0.5 rounded font-bold">
            SALE
          </div>
        }
      </div>
      <div className="p-2">
        <p className="font-mono text-xs text-gray-800 leading-tight mb-1 truncate">
          {product.name}
        </p>
        {product.sold ? (
        <div className="flex items-center gap-1 mb-1">
          <span className="font-mono text-xs text-gray-500">{product.sold}</span>
        </div>
        ) : null}
        <p className="font-mono text-sm font-bold text-gray-900">
          {product.price}
        </p>
        {product.original ? (
        <p className="font-mono text-xs text-red-500 line-through">
            {product.original}
          </p>
        ) : null}
        <button
          onClick={() =>
          !inCart &&
          addToCart({
            id: product.id,
            name: product.name,
            size: 'ONE SIZE',
            price: product.price,
            image: product.image
          })
          }
          className="mt-2 w-full font-mono text-xs py-1.5 rounded transition-colors font-bold"
          style={{
            backgroundColor: inCart ? 'var(--primary)' : '#000',
            color: '#fff'
          }}>

          {inCart ? '✓ IN CART' : 'ADD TO CART'}
        </button>
      </div>
    </div>);

}
function TodayProductCard({
  product


}: {product: HomeProductCard}) {
  const [liked, setLiked] = useState(false);
  const { addToCart, cartItems } = useCart();
  const inCart = cartItems.some((i) => i.id === product.id);
  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          y: 20
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1]
          }
        }
      }}
      className="bg-white border border-gray-100 rounded-lg overflow-hidden group cursor-pointer shadow-sm">

      <div className="relative h-40 overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />

        <button
          onClick={() => setLiked((l) => !l)}
          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow">

          <Heart
            className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />

        </button>
        {product.original &&
        <div className="absolute top-2 left-2 bg-red-500 text-white font-mono text-xs px-1.5 py-0.5 rounded font-bold">
            SALE
          </div>
        }
      </div>
      <div className="p-2.5">
        <p className="font-mono text-xs text-gray-800 leading-tight mb-1 line-clamp-2">
          {product.name}
        </p>
        {product.sold ? (
        <div className="flex items-center gap-1 mb-1">
          <span className="font-mono text-xs text-gray-500">{product.sold}</span>
        </div>
        ) : null}
        <div className="flex items-baseline gap-1.5">
          <p className="font-mono text-sm font-bold text-gray-900">
            {product.price}
          </p>
          {product.original &&
          <p className="font-mono text-xs text-gray-400 line-through">
              {product.original}
            </p>
          }
        </div>
        <button
          onClick={() =>
          !inCart &&
          addToCart({
            id: product.id,
            name: product.name,
            size: 'ONE SIZE',
            price: product.price,
            image: product.image
          })
          }
          className="mt-2 w-full font-mono text-xs py-1.5 rounded transition-colors font-bold"
          style={{
            backgroundColor: inCart ? 'var(--primary)' : '#000',
            color: '#fff'
          }}>

          {inCart ? '✓ IN CART' : 'ADD TO CART'}
        </button>
      </div>
    </motion.div>);

}
// ─── Main Page ────────────────────────────────────────────────────────────────
export function HomePage() {
  const { products, analytics } = useStore();
  const catalog = useMemo(
    () => activeCatalogProducts(products),
    [products]
  );
  const homeCards = useMemo(
    () =>
      catalog.map((p) =>
        catalogToHomeCard(p, analytics.unitsSoldByProductId[p.id] ?? 0)
      ),
    [catalog, analytics.unitsSoldByProductId]
  );
  const flashProducts = useMemo(() => homeCards.slice(0, 8), [homeCards]);
  const categoryTabs = useMemo(() => {
    const cats = [...new Set(catalog.map((p) => p.category))].sort();
    return cats.length > 0 ? ['ALL', ...cats] : ['ALL'];
  }, [catalog]);
  const productsByTab = useMemo(() => {
    const map: Record<string, HomeProductCard[]> = {};
    for (const tab of categoryTabs) {
      if (tab === 'ALL') {
        map[tab] = homeCards;
      } else {
        map[tab] = homeCards.filter(
          (c) => catalog.find((p) => p.id === c.id)?.category === tab
        );
      }
    }
    return map;
  }, [categoryTabs, homeCards, catalog]);
  const storeShowcase = useMemo(() => {
    const chunks: { price: string; img: string }[][] = [];
    for (let i = 0; i < homeCards.length; i += 3) {
      chunks.push(
        homeCards.slice(i, i + 3).map((p) => ({
          price: p.price,
          img: p.image
        }))
      );
    }
    return chunks.slice(0, 4);
  }, [homeCards]);
  const [activeTab, setActiveTab] = useState('');
  const [heroDot, setHeroDot] = useState(0);
  const flashScrollRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!activeTab && categoryTabs[0]) setActiveTab(categoryTabs[0]);
  }, [activeTab, categoryTabs]);
  const scrollFlash = (dir: 'left' | 'right') => {
    if (flashScrollRef.current) {
      flashScrollRef.current.scrollBy({
        left: dir === 'right' ? 200 : -200,
        behavior: 'smooth'
      });
    }
  };
  const site = useVisitorSite();
  const homeOrder = useMemo(
    () => sortedVisibleHomeSections(site.home.sections),
    [site.home.sections]
  );
  const show = (id: HomeSectionId) => homeOrder.includes(id);
  const heroImg =
    site.home.hero.heroImageUrl?.trim().length > 0
      ? site.home.hero.heroImageUrl
      : HERO_IMAGE;
  const heroBg = `radial-gradient(ellipse at 70% 50%, ${site.theme.primary} 0%, ${site.theme.dark} 100%)`;
  const hCopy = site.home.hero;
  return (
    <div
      className="w-full"
      style={{
        backgroundColor: 'var(--primary)'
      }}>

      {show('marquee') && (
      <Marquee
        text={site.marquee.text}
        durationSeconds={site.marquee.durationSeconds} />

      )}
      {show('hero') && (
      <section
        className="relative overflow-hidden"
        style={{
          background: heroBg
        }}>

        <StudioSelectBar panel="home-editor" label="Hero" block="hero" />
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true">

          <div
            className="absolute top-10 left-10 w-64 h-64 rounded-full opacity-10"
            style={{
              background: 'radial-gradient(circle, #fff 0%, transparent 70%)'
            }} />

          <div
            className="absolute bottom-10 left-1/3 w-96 h-96 rounded-full opacity-5"
            style={{
              background: 'radial-gradient(circle, #fff 0%, transparent 70%)'
            }} />

          <div
            className="absolute top-1/4 right-1/4 w-48 h-48 rounded-full opacity-10"
            style={{
              background:
              'radial-gradient(circle, var(--red) 0%, transparent 70%)'
            }} />

        </div>

        <div className="relative max-w-screen-xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.p
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.1
              }}
              className="font-mono text-xs text-white/60 uppercase tracking-[0.3em] mb-4">

              {hCopy.eyebrow}
            </motion.p>
            <motion.h1
              initial={{
                opacity: 0,
                y: 40
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.2,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="font-anton text-6xl md:text-8xl text-white leading-none uppercase mb-4">

              {hCopy.line1}
              <br />
              <span
                style={{
                  color: 'var(--red)'
                }}>

                {hCopy.line2Accent}
              </span>
              <br />
              {hCopy.line3}
            </motion.h1>
            <motion.p
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.4
              }}
              className="font-mono text-sm text-white/70 mb-8 max-w-sm leading-relaxed">

              {hCopy.sub}
            </motion.p>
            <motion.div
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.5
              }}
              className="flex gap-3 flex-wrap">

              <Link
                to={hCopy.primaryCtaHref || '/shop'}
                className="font-mono text-sm uppercase tracking-widest text-white px-8 py-3 font-bold transition-colors"
                style={{
                  backgroundColor: 'var(--red)'
                }}>

                {hCopy.primaryCtaLabel}
              </Link>
              <Link
                to={hCopy.secondaryCtaHref || '/join'}
                className="font-mono text-sm uppercase tracking-widest text-white px-8 py-3 font-bold border-2 border-white/40 hover:border-white transition-colors">

                {hCopy.secondaryCtaLabel}
              </Link>
            </motion.div>
            <div className="flex gap-2 mt-8">
              {[0, 1, 2].map((i) =>
              <button
                key={i}
                onClick={() => setHeroDot(i)}
                className="w-2.5 h-2.5 rounded-full transition-colors"
                style={{
                  backgroundColor:
                  heroDot === i ? '#fff' : 'rgba(255,255,255,0.3)'
                }} />

              )}
            </div>
          </div>

          <div className="relative flex justify-center items-center">
            <div
              className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full"
              style={{
                background:
                'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                filter: 'blur(20px)'
              }} />

            <motion.div
              animate={{
                rotate: 360
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: 'linear'
              }}
              className="absolute w-80 h-80 md:w-[420px] md:h-[420px] rounded-full border border-white/10"
              style={{
                borderStyle: 'dashed'
              }} />

            <motion.div
              animate={{
                rotate: -360
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear'
              }}
              className="absolute w-64 h-64 md:w-[340px] md:h-[340px] rounded-full border border-white/10" />

            <motion.div
              animate={{
                rotate: 360
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: 'linear'
              }}
              className="relative z-10">

              <img
                src={heroImg}
                alt="Ladies Oil Product"
                className="w-56 h-56 md:w-80 md:h-80 object-cover rounded-full shadow-2xl border-4 border-white/20"
                style={{
                  filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.2))'
                }} />

            </motion.div>
            <motion.div
              animate={{
                y: [0, -10, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute top-4 right-4 md:right-0 bg-white rounded-xl px-3 py-2 shadow-lg z-20">

              <p className="font-mono text-xs text-gray-500">
                {hCopy.floatingBadgeTitle}
              </p>
              <p
                className="font-anton text-lg"
                style={{
                  color: 'var(--primary)'
                }}>

                {hCopy.floatingBadgePromo}
              </p>
            </motion.div>
            <motion.div
              animate={{
                y: [0, 8, 0]
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5
              }}
              className="absolute bottom-8 left-0 md:-left-4 bg-white rounded-xl px-3 py-2 shadow-lg z-20">

              <p className="font-mono text-xs text-gray-500">
                {hCopy.floatingPriceCaption}
              </p>
              <p
                className="font-anton text-lg"
                style={{
                  color: 'var(--red)'
                }}>

                {hCopy.floatingPrice}
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {show('categories') && (
      <section className="relative py-6 px-6 border-b border-white/10">
        <StudioSelectBar panel="sections" label="Categories" block="categories" />
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(({ label, icon: Icon }) =>
            <button
              key={label}
              className="flex flex-col items-center gap-2 flex-shrink-0 group">

                <div
                className="w-14 h-14 rounded-full flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.15)'
                }}>

                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="font-mono text-xs text-white/70 whitespace-nowrap">
                  {label}
                </span>
              </button>
            )}
          </div>
        </div>
      </section>
      )}

      {show('flashSale') && (
      <section className="relative py-8 px-6 border-b border-white/10">
        <StudioSelectBar panel="sections" label="Flash sale" block="flashSale" />
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 fill-red-500 text-red-500" />
              <h2 className="font-anton text-2xl text-white uppercase">
                Flash Sale
              </h2>
              <FlashCountdown />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scrollFlash('left')}
                className="w-8 h-8 border border-white/30 flex items-center justify-center hover:bg-white/20 transition-colors text-white">

                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollFlash('right')}
                className="w-8 h-8 border border-white/30 flex items-center justify-center hover:bg-white/20 transition-colors text-white">

                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div
            ref={flashScrollRef}
            className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">

            {flashProducts.length === 0 ? (
            <p className="font-mono text-xs text-white/50 py-4">
              Products will appear here when they are added to the catalog.
            </p>
            ) : (
            flashProducts.map((p) =>
            <FlashProductCard key={p.id} product={p} />
            )
            )}
          </div>
        </div>
      </section>
      )}

      {show('todaysForYou') && (
      <section className="relative py-8 px-6 border-b border-white/10">
        <StudioSelectBar panel="sections" label="Product tabs" block="todaysForYou" />
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <h2 className="font-anton text-2xl text-white uppercase mr-2">
              Todays For You!
            </h2>
            {categoryTabs.map((tab) =>
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="font-mono text-xs px-4 py-1.5 rounded-full border transition-colors"
              style={{
                backgroundColor: activeTab === tab ? '#fff' : 'transparent',
                color: activeTab === tab ? 'var(--primary)' : '#fff',
                borderColor:
                activeTab === tab ? '#fff' : 'rgba(255,255,255,0.4)'
              }}>

                {tab}
              </button>
            )}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              ref={todayRef}
              initial="hidden"
              animate="visible"
              exit={{
                opacity: 0,
                y: -10,
                transition: {
                  duration: 0.2
                }
              }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.07
                  }
                }
              }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">

              {(productsByTab[activeTab] ?? []).length === 0 ? (
              <p className="col-span-full font-mono text-xs text-white/50 py-6 text-center">
                No products in this category yet.
              </p>
              ) : (
              (productsByTab[activeTab] ?? []).map((p) =>
              <TodayProductCard key={p.id} product={p} />
              )
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
      )}

      {show('bestSellingStore') && (
      <section className="relative py-10 px-6 border-b border-white/10">
        <StudioSelectBar panel="sections" label="Store grid" block="bestSellingStore" />
        <div className="max-w-screen-xl mx-auto">
          <h2 className="font-anton text-2xl text-white uppercase mb-6 text-center">
            Best Selling Store
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="relative rounded-xl overflow-hidden flex flex-col items-center justify-end min-h-64"
              style={{
                backgroundColor: 'var(--dark)'
              }}>

              <img
                src={heroImg}
                alt="MS-GLOBAL"
                className="absolute inset-0 w-full h-full object-cover opacity-50" />

              <div className="relative z-10 p-4 text-center">
                <p className="font-anton text-2xl text-white">MS-GLOBAL</p>
                <p className="font-mono text-xs text-white/70">
                  Premium ladies oil & beauty products
                </p>
              </div>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {storeShowcase.length === 0 ? (
              <p className="col-span-full font-mono text-xs text-white/50 text-center py-6">
                More products will appear here soon.
              </p>
              ) : (
              storeShowcase.map((chunk, idx) => (
              <div
                key={idx}
                className="rounded-xl p-3 border border-white/20"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)'
                }}>

                  <div className="flex items-center gap-2 mb-2">
                    <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: '#FF0000'
                    }}>

                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-mono text-xs font-bold text-white">
                        MS-GLOBAL
                      </p>
                      <p className="font-mono text-xs text-white/50">
                        Featured picks
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {chunk.map((p, i) =>
                  <div key={i} className="flex-1">
                        <img
                      src={p.img}
                      alt=""
                      className="w-full h-16 object-cover rounded border border-white/10" />

                        <p className="font-mono text-xs text-white/70 mt-1">
                          {p.price}
                        </p>
                      </div>
                  )}
                  </div>
                </div>
              ))
              )}
            </div>
          </div>
        </div>
      </section>
      )}

      {show('quoteBanner') && (
      <section
        className="relative py-16 px-6"
        style={{
          backgroundColor: 'var(--dark)'
        }}>

        <StudioSelectBar panel="home-editor" label="Quote" block="quoteBanner" />
        <div className="max-w-screen-xl mx-auto text-center">
          <motion.h2
            initial={{
              opacity: 0,
              y: 30
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="font-anton text-4xl md:text-6xl text-white italic">

            {site.home.quoteHeading}
          </motion.h2>
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.5,
              delay: 0.2
            }}
            className="mt-6">

            <Link
              to={site.home.quoteCtaHref || '/join'}
              className="inline-block font-mono text-sm uppercase tracking-widest text-white px-10 py-4 font-bold transition-colors"
              style={{
                backgroundColor: 'var(--red)'
              }}>

              {site.home.quoteCtaLabel}
            </Link>
          </motion.div>
        </div>
      </section>
      )}

      {show('reviews') && <ReviewsSection />}

      {show('footer') && (
      <footer
        className="relative py-12 px-6 border-t border-white/10"
        style={{
          backgroundColor: 'var(--dark)'
        }}>

        <StudioSelectBar panel="seo" label="Footer & SEO" block="footer" />
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <Link
                to="/"
                className="font-anton text-3xl text-white block mb-2">

                {site.footer.brandWord}
                <span
                  style={{
                    color: 'var(--red)'
                  }}>

                  {site.footer.brandAccent}
                </span>
              </Link>
              <p className="font-mono text-xs text-white/50">
                {site.footer.tagline}
              </p>
              <div className="flex gap-3 mt-4">
                {['F', 'T', 'Y', 'I'].map((s) =>
                <div
                  key={s}
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.15)'
                  }}>

                    <span className="font-mono text-xs text-white">{s}</span>
                  </div>
                )}
              </div>
            </div>
            {[
            {
              title: 'About',
              links: ['About Us', 'Career', 'Blog', 'B2B']
            },
            {
              title: 'Buy',
              links: ['Bill & Top Up', 'COD', 'Blog', 'Promo']
            },
            {
              title: 'Sell',
              links: ['Seller Education', 'Brand Index', 'Register Store']
            },
            {
              title: 'Help',
              links: ['Customer Care', 'Terms', 'Privacy', 'FAQ']
            }].
            map((col) =>
            <div key={col.title}>
                <p className="font-mono text-xs font-bold text-white uppercase tracking-widest mb-3">
                  {col.title}
                </p>
                <ul className="space-y-2">
                  {col.links.map((l) =>
                <li key={l}>
                      <a
                    href="#"
                    className="font-mono text-xs text-white/50 hover:text-white transition-colors">

                        {l}
                      </a>
                    </li>
                )}
                </ul>
              </div>
            )}
          </div>
          <div className="border-t border-white/10 pt-6 text-center">
            <p className="font-mono text-xs text-white/30">
              {site.footer.copyright}
            </p>
          </div>
        </div>
      </footer>
      )}
    </div>);

}
function FlashCountdown() {
  const [time, setTime] = useState({
    h: 8,
    m: 17,
    s: 56
  });
  useEffect(() => {
    const id = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) {
          s = 59;
          m--;
        }
        if (m < 0) {
          m = 59;
          h--;
        }
        if (h < 0) {
          h = 23;
          m = 59;
          s = 59;
        }
        return {
          h,
          m,
          s
        };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div className="flex items-center gap-1">
      {[time.h, time.m, time.s].map((v, i) =>
      <Fragment key={i}>
          <span className="font-mono text-xs bg-red-600 text-white px-2 py-1 rounded font-bold min-w-[28px] text-center">
            {pad(v)}
          </span>
          {i < 2 &&
        <span className="font-mono text-xs text-red-400 font-bold">:</span>
        }
        </Fragment>
      )}
    </div>);

}