import React, { useState } from 'react';
import Navbar from './components/Navbar';
import WaxSealPreloader from './components/WaxSealPreloader';
import HeroSection from './components/HeroSection';
import ItinerarySection from './components/ItinerarySection';
import VenueSection from './components/VenueSection';
import WallOfBlessings from './components/WallOfBlessings';
import RollOfHonor from './components/RollOfHonor';
import RsvpModal from './components/RsvpModal';
import AdminDashboardModal from './components/AdminDashboardModal';
import AudioPlayer from './components/AudioPlayer';
import MobileNavigation from './components/MobileNavigation';

export default function App() {
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [hasOpenedInvitation, setHasOpenedInvitation] = useState(false);

  const handleOpenInvitation = () => {
    setHasOpenedInvitation(true);
  };

  const handleScrollToItinerary = () => {
    const el = document.getElementById('itinerary');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F3] text-[#1E2F23] relative font-sans">
      {/* 1. Wax Seal Envelope Preloader (Full screen initial experience) */}
      <WaxSealPreloader onOpenInvitation={handleOpenInvitation} />

      {/* 2. Ambient Indian Classical Shehnai / Flute Music Player */}
      <AudioPlayer autoStart={hasOpenedInvitation} />

      {/* 3. Floating Top Navigation Bar */}
      <Navbar onOpenRsvp={() => setIsRsvpOpen(true)} />

      {/* 4. Main Royal Wedding Sections */}
      <main>
        {/* Sacred Invocation & Couple Hero */}
        <HeroSection 
          onOpenRsvp={() => setIsRsvpOpen(true)} 
          onScrollToItinerary={handleScrollToItinerary}
        />

        {/* Dynamic Theme-Shifting Itinerary */}
        <ItinerarySection />

        {/* Resort Venue & Residence Concierge */}
        <VenueSection />

        {/* Real-time Wall of Blessings */}
        <WallOfBlessings onOpenBlessingModal={() => setIsRsvpOpen(true)} />

        {/* Family Credits & Quick Contacts */}
        <RollOfHonor onOpenAdminModal={() => setIsAdminOpen(true)} />
      </main>

      {/* 5. Mobile-first sticky bottom navigation dock */}
      <MobileNavigation onOpenRsvp={() => setIsRsvpOpen(true)} />

      {/* 6. Multi-Step RSVP & Boarding Pass Modal */}
      <RsvpModal 
        isOpen={isRsvpOpen} 
        onClose={() => setIsRsvpOpen(false)} 
      />

      {/* 7. Secret Family Host Admin Dashboard Modal (PIN: 1502) */}
      <AdminDashboardModal 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
      />
    </div>
  );
}
