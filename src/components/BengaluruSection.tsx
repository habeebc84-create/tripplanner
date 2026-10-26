import { useState } from 'react';
import { BedDouble, Bus, MapPin, Navigation, Route } from 'lucide-react';
import { BENGALURU_PLACES, type BengaluruCategory, type BengaluruPlace } from '../data/bengaluru';
import BengaluruPlaceDetail from './BengaluruPlaceDetail';
import { tr, type Lang } from '../lib/i18n';
import { hotelsSearchUrl, mapsDirectionsTransitUrl, mapsSearchUrl } from '../lib/maps';

const CATEGORIES: BengaluruCategory[] = ['parks', 'temples', 'museums', 'shopping', 'entertainment'];

export default function BengaluruSection({
  lang,
  onPlanBengaluruDay,
}: {
  lang: Lang;
  onPlanBengaluruDay: () => void;
}) {
  const t = (key: string) => tr(lang, key);
  const [category, setCategory] = useState<BengaluruCategory | 'all'>('all');
  const [selectedId, setSelectedId] = useState('lalbagh');
  const [detail, setDetail] = useState<BengaluruPlace | null>(null);

  const selected = BENGALURU_PLACES.find((p) => p.id === selectedId) ?? BENGALURU_PLACES[0];
  const visible = category === 'all' ? BENGALURU_PLACES : BENGALURU_PLACES.filter((p) => p.category === category);
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(selected.name + ', Bengaluru')}&output=embed`;

  return (
    <section id="bengaluru" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-14">
      <h2 className="text-2xl font-bold">{t('bengaluruTitle')}</h2>
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{t('bengaluruSub')}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setCategory('all')}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition hover:-translate-y-0.5 ${
            category === 'all'
              ? 'border-stone-900 bg-stone-900 text-white dark:bg-orange-600 dark:border-orange-600'
              : 'border-stone-300 bg-white text-stone-700 hover:border-orange-400 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200'
          }`}
        >
          {t('allLabel')}
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition hover:-translate-y-0.5 ${
              category === c
                ? 'border-stone-900 bg-stone-900 text-white dark:bg-orange-600 dark:border-orange-600'
                : 'border-stone-300 bg-white text-stone-700 hover:border-orange-400 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200'
            }`}
          >
            {t(`cat_${c}`)}
          </button>
        ))}
      </div>

      {/* Photo strip of famous places */}
      <div className="mt-6">
        <p className="text-sm font-semibold">{t('photosLabel')}</p>
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
          {BENGALURU_PLACES.filter((p) => p.image).map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedId(p.id);
                setDetail(p);
              }}
              className={`group w-48 shrink-0 overflow-hidden rounded-2xl border bg-gradient-to-br from-orange-500 via-amber-500 to-rose-500 text-left shadow-sm transition hover:-translate-y-0.5 ${
                p.id === selectedId
                  ? 'border-orange-500 ring-2 ring-orange-500/40'
                  : 'border-stone-200 dark:border-stone-800'
              }`}
            >
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                className="h-28 w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="block bg-white px-3 py-2 text-xs font-bold dark:bg-stone-900">
                {p.name}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{t('photoCredit')}</p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">        {/* Map view + selected place */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-3xl border border-stone-200 shadow-sm dark:border-stone-800">
            <iframe
              title={selected.name}
              src={mapSrc}
              className="h-[380px] w-full border-0 dark:[filter:invert(90%)_hue-rotate(180deg)]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="mt-4 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm transition duration-300 dark:border-stone-800 dark:bg-stone-900">
            <h3 className="text-lg font-bold">{selected.name}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400">
              <MapPin size={14} /> {selected.area} · {t(`cat_${selected.category}`)}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
              {selected.description}
            </p>
            <p className="mt-3 text-sm text-stone-600 dark:text-stone-300">
              <b>{t('howToGoTitle')}:</b> {selected.howToGo}
            </p>
            {selected.bus && (
              <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
                <b>BMTC from Majestic:</b> {selected.bus}
              </p>
            )}
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
              <b>{t('bestLabel')}:</b> {selected.bestTime} · <b>{t('entryLabel')}:</b> {selected.entryFee}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={mapsDirectionsTransitUrl('Kempegowda Bus Station, Bengaluru', selected.name + ', Bengaluru')}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
              >
                <Bus size={14} /> {t('liveTransit')}
              </a>
              <a
                href={mapsSearchUrl(selected.name + ', Bengaluru')}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold hover:border-orange-400 dark:border-stone-700"
              >
                <Navigation size={14} /> {t('mapsOpen')}
              </a>
              <a
                href={hotelsSearchUrl(selected.name + ', Bengaluru')}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold hover:border-orange-400 dark:border-stone-700"
              >
                <BedDouble size={14} /> {t('hotelsSearch')}
              </a>
            </div>
            <p className="mt-3 text-xs text-stone-500 dark:text-stone-400">{t('mapNote')}</p>
          </div>
        </div>

        {/* Place cards */}
        <div className="grid content-start gap-4 sm:grid-cols-2 lg:col-span-3">
          {visible.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedId(p.id);
                setDetail(p);
              }}
              className={`rounded-3xl border p-4 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md ${
                p.id === selectedId
                  ? 'border-orange-500 bg-orange-50 dark:border-orange-500 dark:bg-orange-900/20'
                  : 'border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900'
              }`}
            >
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="mb-3 h-36 w-full rounded-2xl object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="mb-3 flex h-36 w-full items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-rose-500">
                  <MapPin size={28} className="text-white/80" />
                </div>
              )}
              <p className="text-xs font-bold tracking-wide text-orange-600 uppercase">
                {t(`cat_${p.category}`)}
              </p>
              <h3 className="mt-1 font-bold">{p.name}</h3>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400">
                <MapPin size={12} /> {p.area}
              </p>
              <p className="mt-2 line-clamp-2 text-sm text-stone-600 dark:text-stone-300">
                {p.description}
              </p>
              <p className="mt-2 text-xs font-semibold text-stone-500 dark:text-stone-400">
                {t('bestLabel')}: {p.bestTime}
              </p>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onPlanBengaluruDay}
        className="mt-6 flex items-center gap-2 rounded-full bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-700"
      >
        <Route size={15} /> {t('planBengaluruDay')}
      </button>

      {detail && (
        <BengaluruPlaceDetail
          place={detail}
          lang={lang}
          onClose={() => setDetail(null)}
          onPlanBengaluruDay={() => {
            setDetail(null);
            onPlanBengaluruDay();
          }}
        />
      )}
    </section>
  );
}
