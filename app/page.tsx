export default function Home() {
  return (
    <div>
      <div className="parallax flex items-center justify-center">
        <h1 className="text-5xl text-white font-bold">Recipe Cloud</h1>
      </div>
      <div className="container mx-auto p-8">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">1. Upload</h3>
            <p>
              Snap a photo of your recipe and upload it. We'll handle the rest.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">2. Process</h3>
            <p>
              Our AI will analyze the image and extract the recipe's name,
              ingredients, and instructions.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">3. Refine & Save</h3>
            <p>
              Review and edit the generated recipe to your liking, then save it
              to your personal collection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
