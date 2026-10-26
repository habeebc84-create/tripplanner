import { BedDouble, Bus, CalendarDays, MapPin, Navigation, Route, Ticket, Train, X } from 'lucide-react';
import type { BengaluruPlace } from '../data/bengaluru';
import { tr, type Lang } from '../lib/i18n';
import { hotelsSearchUrl, mapsDirectionsTransitUrl, mapsSearchUrl } from '../lib/maps';

interface BengaluruPlaceDetailProps {
  place: BengaluruPlace;
  lang: Lang;
  onClose: () => void;
  onPlanBengaluruDay: () => void;
}

export default function BengaluruPlaceDetail({
  place,
  lang,
  onClose,
  onPlanBengaluruDay,
}: BengaluruPlaceDetailProps) {
  const t = (key: string) => tr(lang, key);
  const destination = `${place.name}, Bengaluru`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="animate-fade-up max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl transition-colors duration-300 sm:rounded-3xl dark:bg-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {place.image ? (
            <img
              src={place.image}
              alt={place.name}
              className="h-56 w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="h-40 w-full bg-gradient-to-br from-orange-500 via-amber-500 to-rose-500" />
          )}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
          >
            <X size={18} />
          </button>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-6 pt-10 pb-4">
            <p className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-white/90 uppercase">
              <MapPin size={13} /> {place.area} · {t(`cat_${place.category}`)}
            </p>
            <h2 className="mt-1 text-3xl font-extrabold text-white">{place.name}</h2>
          </div>
        </div>

        <div className="space-y-6 p-6">
          <div>
            <h3 className="text-lg font-bold">About this place</h3>
            <p className="mt-2 leading-relaxed text-stone-600 dark:text-stone-300">
              {place.description}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold">What to see</h3>
            <ul className="mt-2 space-y-2">
              {place.highlights.map((h) => (
                <li key={h} className="flex gap-2 text-sm text-stone-600 dark:text-stone-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-stone-100 p-4 dark:bg-stone-800">
              <p className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-stone-500 uppercase dark:text-stone-400">
                <CalendarDays size={13} /> {t('bestLabel')}
              </p>
              <p className="mt-1 text-sm font-semibold">{place.bestTime}</p>
            </div>
            <div className="rounded-2xl bg-stone-100 p-4 dark:bg-stone-800">
              <p className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-stone-500 uppercase dark:text-stone-400">
                <Ticket size={13} /> {t('entryLabel')}
              </p>
              <p className="mt-1 text-sm font-semibold">{place.entryFee}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold">{t('howToGoTitle')}</h3>
            <p className="mt-2 leading-relaxed text-stone-600 dark:text-stone-300">{place.howToGo}</p>
          </div>

          <div>
            <h3 className="text-lg font-bold">Bus &amp; train</h3>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
              Live bus numbers and train times change often, so they are not printed here — tap
              below for live directions from the city&apos;s two main arrival points.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={mapsDirectionsTransitUrl('Kempegowda Bus Station, Bengaluru', destination)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
              >
                <Bus size={14} /> Bus from Majestic (Kempegowda Bus Station)
              </a>
              <a
                href={mapsDirectionsTransitUrl('KSR Bengaluru City Railway Station, Bengaluru', destination)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
              >
                <Train size={14} /> Train arrival via City station
              </a>
              <a
                href={mapsSearchUrl(destination)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold hover:border-orange-400 dark:border-stone-700"
              >
                <Navigation size={14} /> {t('mapsOpen')}
              </a>
              <a
                href={hotelsSearchUrl(destination)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold hover:border-orange-400 dark:border-stone-700"
              >
                <BedDouble size={14} /> {t('hotelsSearch')}
              </a>
            </div>
          </div>

          <button
            onClick={onPlanBengaluruDay}
            className="flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-stone-800 dark:bg-orange-600 dark:hover:bg-orange-700"
          >
            <Route size={15} /> {t('planBengaluruDay')}
          </button>
        </div>
      </div>
    </div>
  );
}
