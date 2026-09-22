import MenuItem from '../models/MenuItem.js';

export const getMenuItems = async (req, res) => {
  try {
    const { category, search, vegOnly } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (vegOnly === 'true') {
      query.isVeg = true;
    }

    const items = await MenuItem.find(query).sort({ isPopular: -1, createdAt: 1 });
    res.json({ count: items.length, items });
  } catch (error) {
    console.error('Erreur menu :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du menu' });
  }
};

export const getCategories = async (req, res) => {
  try {
    const cats = await MenuItem.distinct('category');
    const categories = ['All', ...cats.sort()];
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors des catégories' });
  }
};

export const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Plat introuvable' });
    }
    res.json({ item });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du plat' });
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const { name, category, price, description, image, isVeg, prepTime, isPopular } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ message: 'Nom, catégorie et prix sont requis.' });
    }

    const newItem = await MenuItem.create({
      name,
      category,
      price: parseFloat(price),
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      isVeg: Boolean(isVeg),
      prepTime: prepTime || '20 min',
      isPopular: Boolean(isPopular)
    });

    res.status(201).json({ message: 'Plat ajouté avec succès', item: newItem });
  } catch (error) {
    console.error('Erreur création plat :', error);
    res.status(500).json({ message: 'Erreur lors de la création du plat' });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const updated = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Plat introuvable' });
    }

    res.json({ message: 'Plat mis à jour', item: updated });
  } catch (error) {
    console.error('Erreur mise à jour plat :', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du plat' });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const deleted = await MenuItem.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Plat introuvable' });
    }

    res.json({ message: 'Plat supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression plat :', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du plat' });
  }
};
