/**
 * Bundled example Giraflow models for public mode
 * Imports the actual JSON files from example-giraflows
 */

import type { InformationFlowModel } from './types';

// Import actual example files (Vite handles JSON imports)
import simpleTodoApp from '../../../../example-giraflows/simple-todo-app.giraflow.json';
import shoppingCart from '../../../../example-giraflows/shopping.giraflow.json';
import coloringWishlist from '../../../../example-giraflows/coloring-wishlist.giraflow.json';

export interface Example {
  id: string;
  name: string;
  description: string;
  model: InformationFlowModel;
}

const emptyTemplate: InformationFlowModel = {
  "$schema": "giraflow.schema.json",
  "name": "New Model",
  "description": "Start building your information flow model here",
  "version": "1.0.0",
  "timeline": [
    {
      "type": "state",
      "name": "InitialState",
      "tick": 1,
      "sourcedFrom": [],
      "example": {}
    },
    {
      "type": "actor",
      "name": "User",
      "tick": 2,
      "readsView": "InitialState",
      "sendsCommand": "DoSomething"
    },
    {
      "type": "command",
      "name": "DoSomething",
      "tick": 3,
      "example": { "data": "example" }
    },
    {
      "type": "event",
      "name": "SomethingHappened",
      "tick": 4,
      "producedBy": "DoSomething-3",
      "example": { "result": "success" }
    }
  ],
  "specifications": []
};

export const examples: Example[] = [
  {
    id: 'simple-todo',
    name: 'Simple Todo App',
    description: 'A minimal todo app demonstrating basic event sourcing patterns',
    model: simpleTodoApp as InformationFlowModel
  },
  {
    id: 'shopping-cart',
    name: 'Shopping Cart',
    description: 'An event-sourced shopping cart with the decider pattern',
    model: shoppingCart as InformationFlowModel
  },
  {
    id: 'coloring-wishlist',
    name: 'Coloring Picture Wishlist',
    description: 'A complex workflow with moderation, AI generation, and notifications',
    model: coloringWishlist as InformationFlowModel
  },
  {
    id: 'empty-template',
    name: 'Empty Template',
    description: 'A blank template to start your own model',
    model: emptyTemplate
  }
];

export function getExampleById(id: string): Example | undefined {
  return examples.find(e => e.id === id);
}

export function getDefaultExample(): Example {
  return examples[0];
}
