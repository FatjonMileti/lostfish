export const generateLinksForMatchesImages = (docs: any[]) => {
  return docs.map((item: any) => {
    const { property } = item;
    if (property) {
      const { property_images } = property;
      property.property_images = generateLinksForOneAsset(property_images);
      item.property = property;
    }
    return item;
  });
};

export const generateLinksForOneAsset = (propertyImages: any[]) => {
  return propertyImages.map((img: any) => {
    return {
      key: img.key,
      link: img.link
    };
  });
};
