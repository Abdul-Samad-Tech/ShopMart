import { MapPin, Calendar } from 'lucide-react';
import CinematicPageSection from './CinematicPageSection';
import { HOME_PAGE_STORIES } from './home.constant';

const DynamicHubSections = ({
  brands = [],
  stores = [],
  blogPosts = [],
  events = [],
  pageContent = {},
}) => {
  const brandList = Array.isArray(brands) ? brands : brands?.brands || [];
  const storeList = Array.isArray(stores) ? stores : stores?.stores || [];
  const posts = Array.isArray(blogPosts) ? blogPosts : blogPosts?.posts || [];
  const eventList = Array.isArray(events) ? events : events?.events || [];

  const featuredStore = storeList[0];
  const featuredPost = posts[0];
  const featuredEvent = eventList[0];

  const sections = [];

  if (brandList.length > 0) {
    sections.push({
      key: 'brands',
      label: 'Our Brands',
      title: 'Trusted names in every aisle',
      description:
        'Partner brands stocked across ShopMart — from pantry staples to household essentials.',
      href: '/brands',
      cta: 'Browse brands',
      tone: 'green',
      image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1600&q=85',
      brandNames: brandList.slice(0, 6).map((brand) => brand.name),
    });
  }

  if (featuredStore) {
    sections.push({
      key: 'stores',
      label: 'Store Locator',
      title: 'Find a ShopMart near you',
      description: 'Fresh aisles, friendly service, and pickup ready when you are.',
      href: '/stores',
      cta: 'Open store locator',
      tone: 'dark',
      image:
        featuredStore.image ||
        'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1600&q=85',
      meta: (
        <span className="inline-flex items-center gap-2">
          <MapPin className="w-4 h-4 text-mart-orange shrink-0" />
          {featuredStore.name}
          {featuredStore.city ? `, ${featuredStore.city}` : ''}
          {storeList.length > 1 ? ` · ${storeList.length} stores` : ''}
        </span>
      ),
    });
  }

  if (featuredPost) {
    sections.push({
      key: 'blog',
      label: 'Blog',
      title: featuredPost.title,
      description:
        featuredPost.excerpt ||
        'Tips, recipes, and mart news from the ShopMart editorial desk.',
      href: '/blog',
      cta: 'Read the blog',
      tone: 'orange',
      image:
        featuredPost.image ||
        'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1600&q=85',
    });
  }

  if (featuredEvent) {
    sections.push({
      key: 'events',
      label: 'Events',
      title: featuredEvent.title || featuredEvent.name,
      description:
        featuredEvent.description ||
        featuredEvent.location ||
        'In-store events, tastings, and community days.',
      href: '/events',
      cta: 'Browse events',
      tone: 'green',
      image:
        featuredEvent.image ||
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=85',
      meta: (
        <span className="inline-flex items-center gap-2">
          <Calendar className="w-4 h-4 text-mart-accent" />
          {featuredEvent.startDate
            ? String(featuredEvent.startDate).slice(0, 10)
            : 'Upcoming'}
        </span>
      ),
    });
  }

  HOME_PAGE_STORIES.forEach((story) => {
    const content = pageContent[story.key];
    sections.push({
      key: story.key,
      label: story.label,
      href: story.href,
      cta: story.cta,
      tone: story.tone,
      image: content?.heroImage || story.image,
      title: content?.title || story.fallbackTitle,
      description: content?.subtitle || content?.description || story.fallbackDesc,
    });
  });

  return (
    <>
      {sections.map((section, index) => {
        // Even: content left + image right | Odd: content right + image left
        const imageOnRight = index % 2 === 0;
        const reverse = !imageOnRight;

        return (
          <CinematicPageSection
            key={section.key}
            index={index}
            variant="split"
            reverse={reverse}
            label={section.label}
            title={section.title}
            description={section.description}
            href={section.href}
            cta={section.cta}
            tone={section.tone}
            image={section.image}
            meta={section.meta}
          >
            {section.brandNames?.length ? (
              <ul className="flex flex-wrap gap-2 max-w-md">
                {section.brandNames.map((name) => (
                  <li
                    key={name}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white dark:bg-mono-surface text-luxury-charcoal dark:text-white border border-luxury-line dark:border-mono-line shadow-sm"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            ) : null}
          </CinematicPageSection>
        );
      })}
    </>
  );
};

export default DynamicHubSections;
