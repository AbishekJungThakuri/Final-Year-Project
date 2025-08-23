export function transformMapData(mapData) {
  const steps = [];
  const routes = [];

  let activityIndex = 0; // adjusted index (skipping transport)

  for (const day of mapData) {
    for (const step of day.steps) {
      if (step.category === "transport" && step.route) {
        routes.push({
          id: step.id,
          start_city: step.route.start_city,
          end_city: step.route.end_city,
          path: step.route.path.map((p) => ({
            latitude: p.latitude,
            longitude: p.longitude,
          })),
          distance: step.route.distance,
          duration: step.route.duration,
        });
      } else if (
        (step.category === "visit" || step.category === "activity") &&
        step.place
      ) {
        const place = {
          id: step.place.id,
          name: step.place.name,
          category: step.place.category,
        }
        steps.push({
          id: step.id,
          index: activityIndex,
          title: step.title,
          image: step.image?.url || null,
          latitude: step.place.latitude,
          longitude: step.place.longitude,
          place: place,
        });
        activityIndex++;
      }
    }
  }

  return { steps, routes };
}
