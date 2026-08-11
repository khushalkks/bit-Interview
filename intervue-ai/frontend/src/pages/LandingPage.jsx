import React from 'react';
import MainLayout from '../layouts/MainLayout';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import InterviewTypes from '../components/InterviewTypes';
import InterviewPreview from '../components/InterviewPreview';
import AnalyticsPreview from '../components/AnalyticsPreview';
import CTA from '../components/CTA';

export default function LandingPage() {
  return (
    <MainLayout>
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <InterviewTypes />
      <InterviewPreview />
      <AnalyticsPreview />
      <CTA />
    </MainLayout>
  );
}
