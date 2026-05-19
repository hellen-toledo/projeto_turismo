import type { CityGalleryItemFormValue } from '../types/admin';
import { createEmptyCityGalleryItem } from '../types/admin';

type SetGalleryItems = (items: CityGalleryItemFormValue[]) => void;

export const useGalleryItems = (gallery: CityGalleryItemFormValue[], setGallery: SetGalleryItems) => {
  const updateGalleryItem = (itemId: string, updater: (item: CityGalleryItemFormValue) => CityGalleryItemFormValue) => {
    setGallery(gallery.map((item) => (item.id === itemId ? updater(item) : item)));
  };

  const addGalleryItem = () => {
    setGallery([...gallery, createEmptyCityGalleryItem(gallery.length)]);
  };

  const removeGalleryItem = (itemId: string) => {
    const nextGallery = gallery.filter((item) => item.id !== itemId);
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

    setGallery(normalizedGallery);
  };

  const markGalleryCover = (itemId: string) => {
    setGallery(gallery.map((item) => ({
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
