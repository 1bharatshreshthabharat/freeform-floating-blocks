export const themes = {
    fridge: {
      items: [
        { id: '1', name: 'Apple', emoji: '🍎', category: 'fruits' },
        { id: '2', name: 'Milk', emoji: '🥛', category: 'dairy' },
        { id: '3', name: 'Carrot', emoji: '🥕', category: 'vegetables' },
        { id: '4', name: 'Cheese', emoji: '🧀', category: 'dairy' },
        { id: '5', name: 'Banana', emoji: '🍌', category: 'fruits' },
        { id: '6', name: 'Yogurt', emoji: '🥄', category: 'dairy' },
        { id: '7', name: 'Broccoli', emoji: '🥦', category: 'vegetables' },
        { id: '8', name: 'Orange', emoji: '🍊', category: 'fruits' },
        { id: '9', name: 'Butter', emoji: '🧈', category: 'dairy' },
        { id: '10', name: 'Lettuce', emoji: '🥬', category: 'vegetables' },
        { id: '11', name: 'Chili', emoji: '🌶️', category: 'condiments' },
        { id: '12', name: 'Ketchup', emoji: '🍅', category: 'condiments' }
      ],
      categories: [
        { id: 'fruits', name: 'Fruits', emoji: '🍎', items: [] },
        { id: 'vegetables', name: 'Vegetables', emoji: '🥕', items: [] },
        { id: 'dairy', name: 'Dairy', emoji: '🥛', items: [] },
        { id: 'condiments', name: 'Condiments', emoji: '🍯', items: [] }
      ]
    },
     office: {

      name: '🏢 Office Desk',

      items: [

        { id: '1', name: 'Pen', emoji: '🖊️', category: 'writing' },

        { id: '2', name: 'Stapler', emoji: '📎', category: 'tools' },

        { id: '3', name: 'Calculator', emoji: '🧮', category: 'electronics' },

        { id: '4', name: 'Notebook', emoji: '📓', category: 'paper' },

        { id: '5', name: 'Phone', emoji: '📱', category: 'electronics' },

        { id: '6', name: 'Scissors', emoji: '✂️', category: 'tools' },

        { id: '7', name: 'Post-it', emoji: '📝', category: 'paper' },

        { id: '8', name: 'Laptop', emoji: '💻', category: 'electronics' },

        { id: '9', name: 'Ruler', emoji: '📏', category: 'tools' },

        { id: '10', name: 'Document', emoji: '📄', category: 'paper' },

        { id: '11', name: 'Pencil', emoji: '✏️', category: 'writing' },

        { id: '12', name: 'Marker', emoji: '🖍️', category: 'writing' }

      ],

      categories: [

        { id: 'writing', name: 'Writing Tools', emoji: '✏️', items: [] },

        { id: 'tools', name: 'Office Tools', emoji: '📎', items: [] },

        { id: 'electronics', name: 'Electronics', emoji: '💻', items: [] },

        { id: 'paper', name: 'Paper Items', emoji: '📄', items: [] }

      ]

    },

    toolbox: {

      name: '🔧 Toolbox',

      items: [

        { id: '1', name: 'Hammer', emoji: '🔨', category: 'hand-tools' },

        { id: '2', name: 'Screwdriver', emoji: '🪛', category: 'hand-tools' },

        { id: '3', name: 'Drill', emoji: '🪚', category: 'power-tools' },

        { id: '4', name: 'Wrench', emoji: '🔧', category: 'hand-tools' },

        { id: '5', name: 'Saw', emoji: '🪚', category: 'power-tools' },

        { id: '6', name: 'Nail', emoji: '🔩', category: 'fasteners' },

        { id: '7', name: 'Bolt', emoji: '🔩', category: 'fasteners' },

        { id: '8', name: 'Pliers', emoji: '🔧', category: 'hand-tools' },

        { id: '9', name: 'Level', emoji: '📏', category: 'measuring' },

        { id: '10', name: 'Tape Measure', emoji: '📐', category: 'measuring' },

        { id: '11', name: 'Screw', emoji: '🔩', category: 'fasteners' },

        { id: '12', name: 'Sandpaper', emoji: '📄', category: 'supplies' }

      ],

      categories: [

        { id: 'hand-tools', name: 'Hand Tools', emoji: '🔨', items: [] },

        { id: 'power-tools', name: 'Power Tools', emoji: '🪚', items: [] },

        { id: 'fasteners', name: 'Fasteners', emoji: '🔩', items: [] },

        { id: 'measuring', name: 'Measuring', emoji: '📏', items: [] },

        { id: 'supplies', name: 'Supplies', emoji: '📦', items: [] }

      ]

    },
    artstudio: {
  name: '🎨 Art Studio',
  items: [
    { id: '1', name: 'Paintbrush', emoji: '🖌️', category: 'painting' },
    { id: '2', name: 'Palette', emoji: '🎨', category: 'painting' },
    { id: '3', name: 'Crayon', emoji: '🖍️', category: 'drawing' },
    { id: '4', name: 'Pencil', emoji: '✏️', category: 'drawing' },
    { id: '5', name: 'Eraser', emoji: '🩹', category: 'tools' },
    { id: '6', name: 'Canvas', emoji: '🖼️', category: 'surfaces' },
    { id: '7', name: 'Ruler', emoji: '📏', category: 'tools' },
    { id: '8', name: 'Scissors', emoji: '✂️', category: 'tools' },
    { id: '9', name: 'Ink', emoji: '🖋️', category: 'painting' },
    { id: '10', name: 'Marker', emoji: '🖊️', category: 'drawing' },
    { id: '11', name: 'Notebook', emoji: '📓', category: 'surfaces' },
    { id: '12', name: 'Sketchbook', emoji: '📘', category: 'surfaces' }
  ],
  categories: [
    { id: 'painting', name: 'Painting Supplies', emoji: '🎨', items: [] },
    { id: 'drawing', name: 'Drawing Tools', emoji: '✏️', items: [] },
    { id: 'tools', name: 'Art Tools', emoji: '🧰', items: [] },
    { id: 'surfaces', name: 'Surfaces', emoji: '🖼️', items: [] }
  ]
},
    wizard: {
  name: '🧙 Wizard’s Inventory',
  items: [
    { id: '1', name: 'Wand', emoji: '🪄', category: 'magic' },
    { id: '2', name: 'Potion', emoji: '🧪', category: 'alchemy' },
    { id: '3', name: 'Crystal Ball', emoji: '🔮', category: 'magic' },
    { id: '4', name: 'Amulet', emoji: '🧿', category: 'artifacts' },
    { id: '5', name: 'Spellbook', emoji: '📖', category: 'books' },
    { id: '6', name: 'Scroll', emoji: '📜', category: 'books' },
    { id: '7', name: 'Dagger', emoji: '🗡️', category: 'weapons' },
    { id: '8', name: 'Staff', emoji: '🪄', category: 'weapons' },
    { id: '9', name: 'Ring', emoji: '💍', category: 'artifacts' },
    { id: '10', name: 'Cauldron', emoji: '⚗️', category: 'alchemy' },
    { id: '11', name: 'Herbs', emoji: '🌿', category: 'alchemy' },
    { id: '12', name: 'Broomstick', emoji: '🧹', category: 'magic' }
  ],
  categories: [
    { id: 'magic', name: 'Magical Tools', emoji: '🪄', items: [] },
    { id: 'alchemy', name: 'Alchemy', emoji: '🧪', items: [] },
    { id: 'artifacts', name: 'Artifacts', emoji: '🔮', items: [] },
    { id: 'books', name: 'Spell Texts', emoji: '📖', items: [] },
    { id: 'weapons', name: 'Weapons', emoji: '🗡️', items: [] }
  ]
},
    zoo: {
  name: '🐾 Animal Habitat',
  items: [
    { id: '1', name: 'Lion', emoji: '🦁', category: 'savanna' },
    { id: '2', name: 'Elephant', emoji: '🐘', category: 'savanna' },
    { id: '3', name: 'Penguin', emoji: '🐧', category: 'arctic' },
    { id: '4', name: 'Seal', emoji: '🦭', category: 'arctic' },
    { id: '5', name: 'Camel', emoji: '🐫', category: 'desert' },
    { id: '6', name: 'Fennec Fox', emoji: '🦊', category: 'desert' },
    { id: '7', name: 'Parrot', emoji: '🦜', category: 'jungle' },
    { id: '8', name: 'Monkey', emoji: '🐒', category: 'jungle' },
    { id: '9', name: 'Shark', emoji: '🦈', category: 'ocean' },
    { id: '10', name: 'Octopus', emoji: '🐙', category: 'ocean' },
    { id: '11', name: 'Snake', emoji: '🐍', category: 'jungle' },
    { id: '12', name: 'Polar Bear', emoji: '🐻‍❄️', category: 'arctic' }
  ],
  categories: [
    { id: 'savanna', name: 'Savanna', emoji: '🌾', items: [] },
    { id: 'arctic', name: 'Arctic', emoji: '❄️', items: [] },
    { id: 'desert', name: 'Desert', emoji: '🏜️', items: [] },
    { id: 'jungle', name: 'Jungle', emoji: '🌴', items: [] },
    { id: 'ocean', name: 'Ocean', emoji: '🌊', items: [] }
  ]
}
,
    birthday: {
  name: '🎉 Birthday Bash',
  items: [
    { id: '1', name: 'Cake', emoji: '🎂', category: 'food' },
    { id: '2', name: 'Pizza', emoji: '🍕', category: 'food' },
    { id: '3', name: 'Juice', emoji: '🧃', category: 'drinks' },
    { id: '4', name: 'Ice Cream', emoji: '🍦', category: 'food' },
    { id: '5', name: 'Gift', emoji: '🎁', category: 'gifts' },
    { id: '6', name: 'Card', emoji: '💌', category: 'gifts' },
    { id: '7', name: 'Balloon', emoji: '🎈', category: 'decor' },
    { id: '8', name: 'Banner', emoji: '🎊', category: 'decor' },
    { id: '9', name: 'Confetti', emoji: '🎉', category: 'fun' },
    { id: '10', name: 'Piñata', emoji: '🪅', category: 'fun' },
    { id: '11', name: 'Hat', emoji: '🎩', category: 'fun' },
    { id: '12', name: 'Soda', emoji: '🥤', category: 'drinks' }
  ],
  categories: [
    { id: 'food', name: 'Food', emoji: '🍕', items: [] },
    { id: 'drinks', name: 'Drinks', emoji: '🥤', items: [] },
    { id: 'gifts', name: 'Gifts', emoji: '🎁', items: [] },
    { id: 'decor', name: 'Decorations', emoji: '🎈', items: [] },
    { id: 'fun', name: 'Fun & Games', emoji: '🪅', items: [] }
  ]
}
,
    sciencelab: {
  name: '🧬 Science Lab',
  items: [
    { id: '1', name: 'Microscope', emoji: '🔬', category: 'equipment' },
    { id: '2', name: 'Test Tube', emoji: '🧪', category: 'glassware' },
    { id: '3', name: 'Beaker', emoji: '🧫', category: 'glassware' },
    { id: '4', name: 'DNA Strand', emoji: '🧬', category: 'biology' },
    { id: '5', name: 'Atom Model', emoji: '⚛️', category: 'physics' },
    { id: '6', name: 'Petri Dish', emoji: '🧫', category: 'biology' },
    { id: '7', name: 'Gloves', emoji: '🧤', category: 'safety' },
    { id: '8', name: 'Goggles', emoji: '🥽', category: 'safety' },
    { id: '9', name: 'Magnet', emoji: '🧲', category: 'physics' },
    { id: '10', name: 'Fire Extinguisher', emoji: '🧯', category: 'safety' },
    { id: '11', name: 'Graduated Cylinder', emoji: '🧪', category: 'glassware' },
    { id: '12', name: 'Chemical Flask', emoji: '⚗️', category: 'glassware' }
  ],
  categories: [
    { id: 'glassware', name: 'Glassware', emoji: '🧪', items: [] },
    { id: 'biology', name: 'Biology Tools', emoji: '🧬', items: [] },
    { id: 'physics', name: 'Physics Tools', emoji: '⚛️', items: [] },
    { id: 'safety', name: 'Safety Gear', emoji: '🧤', items: [] },
    { id: 'equipment', name: 'Lab Equipment', emoji: '🔬', items: [] }
  ]
}
,
    spacestation: {
  name: '🌌 Space Station',
  items: [
    { id: '1', name: 'Astronaut', emoji: '👨‍🚀', category: 'crew' },
    { id: '2', name: 'Helmet', emoji: '🪖', category: 'gear' },
    { id: '3', name: 'Satellite', emoji: '🛰️', category: 'tech' },
    { id: '4', name: 'Rocket', emoji: '🚀', category: 'vehicles' },
    { id: '5', name: 'Control Panel', emoji: '🎛️', category: 'tech' },
    { id: '6', name: 'Space Suit', emoji: '🧑‍🚀', category: 'gear' },
    { id: '7', name: 'Food Pack', emoji: '🍱', category: 'supplies' },
    { id: '8', name: 'Oxygen Tank', emoji: '🧯', category: 'supplies' },
    { id: '9', name: 'Moon Rover', emoji: '🚙', category: 'vehicles' },
    { id: '10', name: 'Telescope', emoji: '🔭', category: 'tech' },
    { id: '11', name: 'Fuel', emoji: '🛢️', category: 'supplies' },
    { id: '12', name: 'Captain', emoji: '🧑‍✈️', category: 'crew' }
  ],
  categories: [
    { id: 'crew', name: 'Crew Members', emoji: '👨‍🚀', items: [] },
    { id: 'gear', name: 'Space Gear', emoji: '🧑‍🚀', items: [] },
    { id: 'tech', name: 'Technology', emoji: '🛰️', items: [] },
    { id: 'vehicles', name: 'Vehicles', emoji: '🚀', items: [] },
    { id: 'supplies', name: 'Supplies', emoji: '🍱', items: [] }
  ]
}
,
    movieset: {
  name: '🎬 Movie Set',
  items: [
    { id: '1', name: 'Camera', emoji: '🎥', category: 'equipment' },
    { id: '2', name: 'Script', emoji: '📜', category: 'documents' },
    { id: '3', name: 'Director', emoji: '🎬', category: 'crew' },
    { id: '4', name: 'Actor', emoji: '🧑‍🎤', category: 'crew' },
    { id: '5', name: 'Costume', emoji: '👗', category: 'wardrobe' },
    { id: '6', name: 'Makeup Kit', emoji: '💄', category: 'wardrobe' },
    { id: '7', name: 'Microphone', emoji: '🎙️', category: 'equipment' },
    { id: '8', name: 'Clapperboard', emoji: '🎬', category: 'equipment' },
    { id: '9', name: 'Props', emoji: '🎭', category: 'props' },
    { id: '10', name: 'Lights', emoji: '💡', category: 'equipment' },
    { id: '11', name: 'Tickets', emoji: '🎟️', category: 'documents' },
    { id: '12', name: 'Set Design', emoji: '🏗️', category: 'props' }
  ],
  categories: [
    { id: 'equipment', name: 'Film Equipment', emoji: '🎥', items: [] },
    { id: 'documents', name: 'Documents', emoji: '📜', items: [] },
    { id: 'crew', name: 'Crew Members', emoji: '🎬', items: [] },
    { id: 'wardrobe', name: 'Wardrobe & Makeup', emoji: '👗', items: [] },
    { id: 'props', name: 'Props & Set', emoji: '🎭', items: [] }
  ]
}
,
    kitchen: {
  name: '🍽️ Restaurant Kitchen',
  items: [
    { id: '1', name: 'Knife', emoji: '🔪', category: 'utensils' },
    { id: '2', name: 'Pan', emoji: '🍳', category: 'cookware' },
    { id: '3', name: 'Pot', emoji: '🥘', category: 'cookware' },
    { id: '4', name: 'Spatula', emoji: '🥄', category: 'utensils' },
    { id: '5', name: 'Lettuce', emoji: '🥬', category: 'ingredients' },
    { id: '6', name: 'Chicken', emoji: '🍗', category: 'ingredients' },
    { id: '7', name: 'Salt', emoji: '🧂', category: 'seasoning' },
    { id: '8', name: 'Pepper', emoji: '🌶️', category: 'seasoning' },
    { id: '9', name: 'Plate', emoji: '🍽️', category: 'serving' },
    { id: '10', name: 'Glass', emoji: '🥛', category: 'serving' },
    { id: '11', name: 'Apron', emoji: '🧥', category: 'gear' },
    { id: '12', name: 'Oven Mitts', emoji: '🧤', category: 'gear' }
  ],
  categories: [
    { id: 'utensils', name: 'Utensils', emoji: '🥄', items: [] },
    { id: 'cookware', name: 'Cookware', emoji: '🍳', items: [] },
    { id: 'ingredients', name: 'Ingredients', emoji: '🥬', items: [] },
    { id: 'seasoning', name: 'Seasonings', emoji: '🧂', items: [] },
    { id: 'serving', name: 'Serving Items', emoji: '🍽️', items: [] },
    { id: 'gear', name: 'Kitchen Gear', emoji: '🧥', items: [] }
  ]
}
,
camping: {
  name: '🏕️ Camping Adventure',
  items: [
    { id: '1', name: 'Tent', emoji: '⛺', category: 'gear' },
    { id: '2', name: 'Sleeping Bag', emoji: '🛏️', category: 'gear' },
    { id: '3', name: 'Campfire', emoji: '🔥', category: 'setup' },
    { id: '4', name: 'Lantern', emoji: '🏮', category: 'lighting' },
    { id: '5', name: 'Map', emoji: '🗺️', category: 'navigation' },
    { id: '6', name: 'Compass', emoji: '🧭', category: 'navigation' },
    { id: '7', name: 'Hotdog', emoji: '🌭', category: 'food' },
    { id: '8', name: 'Water Bottle', emoji: '💧', category: 'food' },
    { id: '9', name: 'Insect Repellent', emoji: '🦟', category: 'safety' },
    { id: '10', name: 'First Aid Kit', emoji: '🩹', category: 'safety' },
    { id: '11', name: 'Flashlight', emoji: '🔦', category: 'lighting' },
    { id: '12', name: 'Backpack', emoji: '🎒', category: 'gear' }
  ],
  categories: [
    { id: 'gear', name: 'Camping Gear', emoji: '🎒', items: [] },
    { id: 'setup', name: 'Camp Setup', emoji: '⛺', items: [] },
    { id: 'lighting', name: 'Lighting', emoji: '🔦', items: [] },
    { id: 'navigation', name: 'Navigation', emoji: '🧭', items: [] },
    { id: 'food', name: 'Food & Drink', emoji: '🌭', items: [] },
    { id: 'safety', name: 'Safety', emoji: '🩹', items: [] }
  ]
}
,
   classroom: {
  name: '🏫 Classroom Essentials',
  items: [
    { id: '1', name: 'Chalkboard', emoji: '🧑‍🏫', category: 'teaching' },
    { id: '2', name: 'Desk', emoji: '🪑', category: 'furniture' },
    { id: '3', name: 'Books', emoji: '📚', category: 'learning' },
    { id: '4', name: 'Notebook', emoji: '📓', category: 'learning' },
    { id: '5', name: 'Ruler', emoji: '📏', category: 'tools' },
    { id: '6', name: 'Eraser', emoji: '🧽', category: 'tools' },
    { id: '7', name: 'Crayons', emoji: '🖍️', category: 'supplies' },
    { id: '8', name: 'Backpack', emoji: '🎒', category: 'supplies' },
    { id: '9', name: 'Teacher', emoji: '👩‍🏫', category: 'people' },
    { id: '10', name: 'Student', emoji: '🧒', category: 'people' },
    { id: '11', name: 'Chair', emoji: '🪑', category: 'furniture' },
    { id: '12', name: 'Globe', emoji: '🌍', category: 'teaching' }
  ],
  categories: [
    { id: 'teaching', name: 'Teaching Tools', emoji: '🧑‍🏫', items: [] },
    { id: 'learning', name: 'Learning Materials', emoji: '📚', items: [] },
    { id: 'tools', name: 'Measuring Tools', emoji: '📏', items: [] },
    { id: 'supplies', name: 'School Supplies', emoji: '🎒', items: [] },
    { id: 'furniture', name: 'Furniture', emoji: '🪑', items: [] },
    { id: 'people', name: 'People', emoji: '👩‍🏫', items: [] }
  ]
}
,
   trainstation: {
  name: '🚂 Train Station',
  items: [
    { id: '1', name: 'Train', emoji: '🚆', category: 'vehicles' },
    { id: '2', name: 'Conductor', emoji: '👨‍✈️', category: 'staff' },
    { id: '3', name: 'Ticket', emoji: '🎟️', category: 'documents' },
    { id: '4', name: 'Platform Sign', emoji: '🚉', category: 'infrastructure' },
    { id: '5', name: 'Suitcase', emoji: '🧳', category: 'luggage' },
    { id: '6', name: 'Passenger', emoji: '🧑‍🦰', category: 'people' },
    { id: '7', name: 'Clock', emoji: '🕒', category: 'infrastructure' },
    { id: '8', name: 'Track', emoji: '🛤️', category: 'infrastructure' },
    { id: '9', name: 'Train Whistle', emoji: '📯', category: 'tools' },
    { id: '10', name: 'ID Card', emoji: '🪪', category: 'documents' },
    { id: '11', name: 'Luggage Cart', emoji: '🛒', category: 'luggage' },
    { id: '12', name: 'Security Guard', emoji: '🧍‍♂️', category: 'staff' }
  ],
  categories: [
    { id: 'vehicles', name: 'Vehicles', emoji: '🚆', items: [] },
    { id: 'staff', name: 'Station Staff', emoji: '👨‍✈️', items: [] },
    { id: 'documents', name: 'Tickets & IDs', emoji: '🪪', items: [] },
    { id: 'infrastructure', name: 'Station Infrastructure', emoji: '🚉', items: [] },
    { id: 'luggage', name: 'Luggage', emoji: '🧳', items: [] },
    { id: 'people', name: 'People', emoji: '🧑‍🦰', items: [] },
    { id: 'tools', name: 'Train Tools', emoji: '📯', items: [] }
  ]
}

  };
