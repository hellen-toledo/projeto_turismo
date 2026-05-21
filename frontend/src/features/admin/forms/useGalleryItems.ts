import type { CityGalleryItemFormValue } from '../types/admin';
import { createEmptyCityGalleryItem } from '../types/admin';

type SetGalleryItems = (
  items: CityGalleryItemFormValue[] | ((currentItems: CityGalleryItemFormValue[]) => CityGalleryItemFormValue[]),
) => void;

export const useGalleryItems = (setGallery: SetGalleryItems) => {
  const updateGalleryItem = (itemId: string, updater: (item: CityGalleryItemFormValue) => CityGalleryItemFormValue) => {
    setGallery((currentGallery) => currentGallery.map((item) => (item.id === itemId ? updater(item) : item)));
  };

  const addGalleryItem = () => {
    setGallery((currentGallery) => [...currentGallery, createEmptyCityGalleryItem(currentGallery.length)]);
  };

  const removeGalleryItem = (itemId: string) => {
    setGallery((currentGallery) => {
      const nextGallery = currentGallery.filter((item) => item.id !== itemId);
      const normalizedGallery = nextGallery.map((item, index) => ({
        ...item,
        sortOrder: index,
        isCover: nextGallery.length === 1 ? true : item.isCover,
      }));

      if (normalizedGallery.length > 0 && normalizedGallery.every((item) => !item.isCover)) {
        normalizedGallery[0] = {
          ...normalizedGallery[0],
          isCover: true,
        };
      }

      return normalizedGallery;
    });
  };

  const markGalleryCover = (itemId: string) => {
    setGallery((currentGallery) => currentGallery.map((item) => ({
      ...item,
      isCover: item.id === itemId,
    })));
  };

  return {
    addGalleryItem,
    markGalleryCover,
    removeGalleryItem,
    updateGalleryItem,
  };
};
