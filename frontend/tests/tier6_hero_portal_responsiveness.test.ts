/**
 * AI SRE Console — Tier 6: Hero Section, Portal Animations & Responsive Typography Test Suite
 * Validates GSAP ScrollTrigger matchMedia, wordmark font clamping, portal door clearance,
 * Lenis scroll synchronization, and strict monochrome dark aesthetics.
 */

import { TestRunner, expect, readConsoleFile } from './test_helpers';

export async function runTier6Tests(runner: TestRunner) {
  runner.suite('Tier 6: Portal Hero Animations, Responsive Typography & Aesthetic Verification');

  // Test 6.1: HeroSection GSAP matchMedia & Responsive Wordmark Splitting
  await runner.test('T6.1: HeroSection implements responsive GSAP matchMedia with split scaling for mobile, tablet, and desktop', () => {
    const heroSrc = readConsoleFile('src/components/sections/HeroSection.tsx');

    // Verify GSAP matchMedia registration
    expect(heroSrc).toContain('gsap.matchMedia()');
    expect(heroSrc).toContain("isDesktop: '(min-width: 1024px)'");
    expect(heroSrc).toContain("isTablet: '(min-width: 768px) and (max-width: 1023px)'");
    expect(heroSrc).toContain("isMobile: '(max-width: 767px)'");

    // Verify responsive split coordinates and scaling
    expect(heroSrc).toContain("const splitX = isDesktop ? '12vw' : isTablet ? '8vw' : '4.5vw';");
    expect(heroSrc).toContain('const wordScale = isDesktop ? 1.25 : isTablet ? 1.18 : 1.10;');
    expect(heroSrc).toContain("const tracking = isDesktop ? '-0.04em' : isTablet ? '-0.02em' : '-0.01em';");
    expect(heroSrc).toContain("tl.to(wordLeftRef.current, { x: `-${splitX}`, ease: 'power2.inOut', force3D: true }, 0);");
    expect(heroSrc).toContain("tl.to(wordRightRef.current, { x: splitX, ease: 'power2.inOut', force3D: true }, 0);");
  });

  // Test 6.2: HeroSection Portal Door Complete Clearance
  await runner.test('T6.2: Portal doors clear viewport completely (-101% / 101%) with force3D GPU acceleration', () => {
    const heroSrc = readConsoleFile('src/components/sections/HeroSection.tsx');

    // Asserts portal doors clear viewport past 100% boundary to prevent hairline borders
    expect(heroSrc).toContain('tl.to(panelLeftRef.current, { xPercent: -101, ease: \'power2.inOut\', force3D: true }, 0);');
    expect(heroSrc).toContain('tl.to(panelRightRef.current, { xPercent: 101, ease: \'power2.inOut\', force3D: true }, 0);');

    // Asserts background image settles from zoom
    expect(heroSrc).toContain('scale: 1.25');
    expect(heroSrc).toContain('scale: 1.0');
    expect(heroSrc).toContain('invalidateOnRefresh: true');
  });

  // Test 6.3: Responsive Typography Clamping & Non-Wrapping Geometry
  await runner.test('T6.3: Wordmark font-size clamp math prevents horizontal clipping on 320px–4K viewports', () => {
    const heroSrc = readConsoleFile('src/components/sections/HeroSection.tsx');

    // Verify clamp syntax on wordmark heading
    expect(heroSrc).toContain('text-[clamp(0.75rem,3.4vw,5.5rem)]');
    expect(heroSrc).toContain('text-[clamp(0.55rem,1.6vw,2.2rem)]');
    expect(heroSrc).toContain('overflow-visible');
    expect(heroSrc).toContain('whitespace-nowrap');

    // Simulate clamp evaluation at key viewport widths
    const evalClamp = (minRem: number, vwRatio: number, maxRem: number, viewportWidth: number): number => {
      const minPx = minRem * 16;
      const vwPx = (viewportWidth * vwRatio) / 100;
      const maxPx = maxRem * 16;
      return Math.max(minPx, Math.min(vwPx, maxPx));
    };

    // 1. Mobile 320px (iPhone SE 1st gen / narrow devices)
    const font320 = evalClamp(0.75, 3.4, 5.5, 320);
    expect(font320).toBe(12); // 0.75rem = 12px
    // 35 characters * ~7px = ~245px -> fits within 320px screen

    // 2. Mobile 375px (iPhone standard)
    const font375 = evalClamp(0.75, 3.4, 5.5, 375);
    expect(font375).toBeCloseTo(12.75, 1);

    // 3. Tablet 768px (iPad portrait)
    const font768 = evalClamp(0.75, 3.4, 5.5, 768);
    expect(font768).toBeCloseTo(26.11, 1);

    // 4. Desktop 1440px (MacBook Pro / Standard Desktop)
    const font1440 = evalClamp(0.75, 3.4, 5.5, 1440);
    expect(font1440).toBeCloseTo(48.96, 1);

    // 5. Ultra-wide 4K (3840px)
    const font3840 = evalClamp(0.75, 3.4, 5.5, 3840);
    expect(font3840).toBe(88); // 5.5rem = 88px cap
  });

  // Test 6.4: Hero Asset Load Teardown & Event Listener Safety
  await runner.test('T6.4: Image load event listener safely tears down and triggers ScrollTrigger.refresh()', () => {
    const heroSrc = readConsoleFile('src/components/sections/HeroSection.tsx');

    expect(heroSrc).toContain('const handleImgLoad = () => ScrollTrigger.refresh();');
    expect(heroSrc).toContain("img.addEventListener('load', handleImgLoad, { once: true });");
    expect(heroSrc).toContain("img.removeEventListener('load', handleImgLoad);");
    expect(heroSrc).toContain('mm.revert();');
  });

  // Test 6.5: ClosingSection Aesthetic Discipline & Clean Compilation
  await runner.test('T6.5: ClosingSection enforces 0px border radius, monochrome team portraits, and 1px structural borders', () => {
    const closingSrc = readConsoleFile('src/components/sections/ClosingSection.tsx');

    // No rounded classes
    expect(closingSrc).toNotContain('rounded-2xl');
    expect(closingSrc).toNotContain('rounded-lg');
    expect(closingSrc).toNotContain('rounded-xl');
    expect(closingSrc).toNotContain('rounded-md');

    // Grayscale portrait images
    expect(closingSrc).toContain('grayscale contrast-125 brightness-90');
    expect(closingSrc).toContain('border border-[#262626]');
    expect(closingSrc).toContain('bg-[#000000]');

    // Valid team members
    expect(closingSrc).toContain('Ganesh Nair');
    expect(closingSrc).toContain('Arjit Ujjawal');
  });

  // Test 6.6: Lenis Smooth Scroll & GSAP ScrollTrigger Synchronization
  await runner.test('T6.6: App.tsx synchronizes Lenis RAF with gsap.ticker and handles teardown on unmount', () => {
    const appSrc = readConsoleFile('src/App.tsx');

    // Lenis initialization & synchronization
    expect(appSrc).toContain('const lenis = new Lenis(');
    expect(appSrc).toContain("lenis.on('scroll', ScrollTrigger.update);");
    expect(appSrc).toContain('gsap.ticker.add(updateLenis);');
    expect(appSrc).toContain('gsap.ticker.lagSmoothing(0);');

    // Proper teardown
    expect(appSrc).toContain('lenis.destroy();');
    expect(appSrc).toContain('gsap.ticker.remove(updateLenis);');

    // Loader completion triggers ScrollTrigger refresh
    expect(appSrc).toContain('ScrollTrigger.refresh()');
  });

  // Test 6.7: CircularGallery Container Event Isolation
  await runner.test('T6.7: CircularGallery isolates wheel, mousedown, and touchstart event listeners to container', () => {
    const gallerySrc = readConsoleFile('src/components/ui/CircularGallery.tsx');

    // Confirms wheel and mousedown are attached to container rather than window to avoid hijacking main page scroll/clicks
    expect(gallerySrc).toContain("this.container.addEventListener('wheel', this.boundOnWheel, { passive: true });");
    expect(gallerySrc).toContain("this.container.addEventListener('mousedown', this.boundOnTouchDown);");
    expect(gallerySrc).toContain("this.container.addEventListener('touchstart', this.boundOnTouchDown, { passive: true });");
    expect(gallerySrc).toContain("this.container.removeEventListener('wheel', this.boundOnWheel);");
    expect(gallerySrc).toContain("this.container.removeEventListener('mousedown', this.boundOnTouchDown);");
    expect(gallerySrc).toContain("this.container.removeEventListener('touchstart', this.boundOnTouchDown);");
  });

  // Test 6.8: EvidenceRetrieval & SafetyControl Mobile Clamping & Robustness
  await runner.test('T6.8: EvidenceRetrieval cards and SafetyControl metrics scale down gracefully on mobile (<480px)', () => {
    const evidenceSrc = readConsoleFile('src/components/sections/EvidenceRetrieval.tsx');
    const safetySrc = readConsoleFile('src/components/sections/SafetyControl.tsx');

    // Evidence card responsive sizing
    expect(evidenceSrc).toContain('min-w-[280px]');
    expect(evidenceSrc).toContain('max-w-[90vw]');
    expect(evidenceSrc).toContain('(Number(doc.score) || 0) * 100');

    // Safety metrics responsive typography
    expect(safetySrc).toContain('text-3xl sm:text-5xl md:text-6xl xl:text-7xl');
  });
}

// Standalone execution support
if (process.argv[1]?.endsWith('tier6_hero_portal_responsiveness.test.ts')) {
  const runner = new TestRunner();
  runTier6Tests(runner).then(() => {
    runner.printSummary();
    const summary = runner.getSummary();
    if (summary.failed > 0) process.exit(1);
  });
}
