import { jsPDF } from 'jspdf';
import type { Itinerary } from './planner';
import { GROUP_SIZE, type BudgetTier, type Group, type Pace } from '../data/destinations';

export interface PdfMeta {
  days: number;
  budget: BudgetTier;
  pace: Pace;
  group: Group;
  startCity: string;
  interestsCount: number;
}

/**
 * Exports the itinerary as a PDF. English only, and amounts use "Rs." because
 * jsPDF's built-in fonts cannot render the rupee sign or Indic scripts.
 */
export function exportItineraryPdf(itinerary: Itinerary, meta: PdfMeta) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const maxWidth = pageWidth - margin * 2;
  let y = 18;

  const rs = (n: number) => `Rs. ${n.toLocaleString('en-IN')}`;

  const line = (text: string, size = 11, bold = false) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, maxWidth);
    for (const l of lines) {
      if (y > 280) {
        doc.addPage();
        y = 18;
      }
      doc.text(l, margin, y);
      y += size * 0.55;
    }
  };

  const gap = (n = 4) => {
    y += n;
  };

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Karnataka Yatra AI — Trip Itinerary', margin, y);
  y += 10;

  line(
    `${meta.days}-day trip · ${meta.budget} budget · ${meta.pace} pace · ${meta.group} (${GROUP_SIZE[meta.group]} traveller(s)) · ${meta.interestsCount > 0 ? `${itinerary.matchScore}% interest match` : 'top-rated picks'}`,
    11,
  );
  gap();
  line(
    `Route: ${itinerary.stops.map((s) => `${s.destination.name} (${s.days}d)`).join(' -> ')}`,
    11,
    true,
  );
  gap(6);

  line('Cost breakdown (indicative)', 13, true);
  line(`Stay: ${rs(itinerary.cost.stay)}`);
  line(`Food: ${rs(itinerary.cost.food)}`);
  line(`Transport: ${rs(itinerary.cost.transport)}`);
  line(`Activities: ${rs(itinerary.cost.activities)}`);
  line(`Estimated total: ${rs(itinerary.cost.total)}`, 11, true);
  gap(6);

  line('Day-by-day plan', 13, true);
  for (const d of itinerary.dayPlans) {
    gap(2);
    line(`Day ${d.day} — ${d.destination.name}`, 12, true);
    if (d.travelFrom) {
      const leg =
        d.travelKm != null && d.travelKm > 0
          ? `Travel: from ${d.travelFrom} · ${d.travelKm} km`
          : d.travelFrom === meta.startCity
            ? `Travel: starting from ${d.travelFrom}`
            : `Travel: ${d.travelFrom} -> ${d.destination.name}`;
      line(leg, 10);
    }
    line(`Morning: ${d.morning}`, 10);
    line(`Afternoon: ${d.afternoon}`, 10);
    line(`Evening: ${d.evening}`, 10);
    line(`Day cost: ${rs(d.dayCost)} · Stay in ${d.destination.name}`, 10);
  }

  if (itinerary.tips.length > 0) {
    gap(6);
    line('Smart tips', 13, true);
    for (const tip of itinerary.tips) {
      line(`- ${tip}`, 10);
    }
  }

  gap(8);
  line(
    'Costs are indicative planning estimates, not live prices. Verify safari, stay and transport bookings before you travel.',
    9,
  );

  doc.save('karnataka-trip-plan.pdf');
}
