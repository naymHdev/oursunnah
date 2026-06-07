import { useRef, useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const posts = [
  {
    id: 1,
    category: 'Style Guide',
    title: 'The Art of Layering: Modest Fashion for Every Season',
    excerpt: 'Discover how to create elegant, layered looks that honor modesty while expressing your personal style.',
    image: 'https://images.pexels.com/photos/6069552/pexels-photo-6069552.jpeg?auto=compress&cs=tinysrgb&w=700&q=85',
    date: 'Ramadan 1446',
    readTime: '5 min',
  },
  {
    id: 2,
    category: 'Home & Living',
    title: 'Creating a Sacred Prayer Corner in Your Home',
    excerpt: 'Transform a quiet corner into a sanctuary for worship with thoughtful Islamic home essentials.',
    image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=700&q=85',
    date: 'Sha\'ban 1446',
    readTime: '4 min',
  },
  {
    id: 3,
    category: 'Heritage',
    title: 'The Craft Behind the Rug: A Journey to Marrakech',
    excerpt: 'We visited the artisans who weave our prayer rugs by hand — a 400-year tradition.',
    image: 'https://images.pexels.com/photos/8533458/pexels-photo-8533458.jpeg?auto=compress&cs=tinysrgb&w=700&q=85',
    date: 'Rajab 1446',
    readTime: '7 min',
  },
];

export default function EditorialSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 lg:py-36 bg-brand-beige">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div
          ref={ref}
          className={`flex flex-col lg:flex-row lg:items-end justify-between mb-14 lg:mb-20 transition-all duration-1000 ease-luxury ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div>
            <p className="section-label">The Journal</p>
            <h2 className="font-serif text-display-md text-brand-charcoal max-w-md">
              Stories of{' '}
              <em className="text-brand-emerald not-italic">Faith & Beauty</em>
            </h2>
          </div>
          <a href="#" className="mt-6 lg:mt-0 btn-ghost text-brand-charcoal group flex items-center gap-2">
            Read the Journal
            <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {posts.map((post, i) => (
            <article
              key={post.id}
              className={`group cursor-pointer transition-all duration-700 ease-luxury ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="overflow-hidden aspect-[4/3] mb-6 bg-brand-beige-dark">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-luxury group-hover:scale-105"
                />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-label uppercase tracking-widest text-brand-gold">{post.category}</span>
                  <span className="w-1 h-1 rounded-full bg-brand-stone/40" />
                  <span className="text-label text-brand-stone uppercase tracking-widest">{post.readTime} read</span>
                </div>
                <h3 className="font-serif text-xl lg:text-2xl text-brand-charcoal mb-3 group-hover:text-brand-emerald transition-colors duration-300 leading-snug">
                  {post.title}
                </h3>
                <p className="text-brand-stone text-sm font-sans leading-relaxed mb-5 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-label text-brand-stone/70 uppercase tracking-widest">{post.date}</span>
                  <span className="text-label uppercase tracking-widest text-brand-emerald flex items-center gap-1.5 group/link">
                    Read More
                    <ArrowRight size={12} className="transition-transform duration-300 group-hover/link:translate-x-1" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
