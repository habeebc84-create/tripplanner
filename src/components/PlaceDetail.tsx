import { CalendarDays, Car, Heart, MapPin, Route, Star, Wallet, X } from 'lucide-react';
import type { Destination } from '../data/destinations';
import { formatINR } from '../lib/planner';
import { INTEREST_LABELS_I18N, tr, type Lang } from '../lib/i18n';

interface PlaceDetailProps {
  place: Destination;
  lang: Lang;
  isFavourite: boolean;
  onToggleFavourite: (id: string) => void;
  onClose: () => void;
  onPlanAround: (place: Destination) => void;
}

export default function PlaceDetail({
  place,
  lang,
  isFavourite,
  onToggleFavourite,
  onClose,
  onPlanAround,
}: PlaceDetailProps) {
  const t = (key: string) => tr(lang, key);
  const interestLabel = INTEREST_LABELS_I18N[lang];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl dark:bg-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`relative bg-gradient-to-br ${place.gradient} px-6 py-8 text-white`}>
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50"
          >
            <X size={18} />
          </button>
          <button
            onClick={() => onToggleFavourite(place.id)}
            aria-label="Favourite"
            className="absolute top-4 right-16 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50"
          >
            <Heart size={18} fill={isFavourite ? '#fff' : 'none'} />
          </button>
          <p className="text-xs font-bold tracking-wide uppercase opacity-80">{place.region}</p>
          <h2 className="mt-1 text-3xl font-extrabold">{place.name}</h2>
          <p className="mt-1 text-sm opacity-90">{place.tagline}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1.5">
              <Star size={15} /> {place.rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays size={15} /> {t('bestLabel')}: {place.bestTime}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={15} /> {place.distanceFromBengaluruKm} km from Bengaluru
            </span>
            <span className="flex items-center gap-1.5">
              <Wallet size={15} /> {t('fromPerDay')} {formatINR(place.costPerDay.moderate)}{t('perDay')}
            </span>
          </div>
        </div>

        <div className="space-y-6 p-6">
          <p className="text-stone-600 dark:text-stone-300">{place.description}</p>

          <div>
            <h3 className="text-lg font-bold">{t('whatToDo')}</h3>
            <ul className="mt-2 space-y-2">
              {place.highlights.map((h) => (
                <li key={h} className="flex gap-2 text-sm text-stone-600 dark:text-stone-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <Car size={18} className="text-orange-600" /> {t('howToReach')}
            </h3>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">{place.howToReach}</p>
          </div>

          <div>
            <h3 className="text-lg font-bold">{t('tipsTitle')}</h3>
            <ul className="mt-2 space-y-2">
              {place.tips.map((tip) => (
                <li key={tip} className="flex gap-2 text-sm text-stone-600 dark:text-stone-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {place.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-200"
              >
                {interestLabel[tag]}
              </span>
            ))}
          </div>

          <button
            onClick={() => onPlanAround(place)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 px-6 py-3.5 font-bold text-white transition hover:scale-[1.01] hover:bg-orange-700"
          >
            <Route size={18} /> {t('planAround')}
          </button>
        </div>
      </div>
    </div>
  );
}
