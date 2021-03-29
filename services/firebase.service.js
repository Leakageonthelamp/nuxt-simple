// import firebase from "../plugins/firebase";

import firebase from "firebase/app";
// GET
export const getListLevel = async () => {
  const levelRef = await firebase.firestore().collection("level");
  const levelData = await levelRef.orderBy("name").get();
  return await levelData.docs.map(doc => {
    // console.log({ id: doc.id, ...doc.data() });
    return { id: doc.id, ...doc.data() };
  });
};

export const getLevelIdBySlug = async levelSlug => {
  const levelRef = await firebase.firestore().collection("level");
  const levelData = await levelRef.where("slug", "==", levelSlug).get();
  console.log("levelData", levelData.docs);
  const level = await levelData.docs.map(doc => {
    console.log({ id: doc.id, ...doc.data() });
    return { id: doc.id, ...doc.data() };
  });
  return level.length ? level[0] : { error: "level not found" };
};

export const getAllCategories = async () => {
  const categoriesRef = await firebase.firestore().collection("categories");
  const categoryData = await categoriesRef.orderBy("createdAt").get();
  const categories = await categoryData.docs.map(doc => {
    return { id: doc.id, ...doc.data() };
  });
  console.log("categories", categories);
  return categories;
};

export const getCategoryById = async id => {
  const categoriesRef = await firebase
    .firestore()
    .collection("categories")
    .doc(id);
  const data = await categoriesRef.get();
  return data;
  // const
};
export const getCategoryByLevel = async level => {
  const categoriesRef = await firebase.firestore().collection("categories");
  const categoryData = await categoriesRef
    .where("level.slug", "==", level.slug)
    .orderBy("createdAt")
    .get();
  console.log("categoryData.docs", categoryData);

  const categories = await categoryData.docs.map(doc => {
    return { id: doc.id, ...doc.data() };
  });
  console.log("categories", categories);
  return categories;
};

export const getVocabularyById = async categoryId => {
  const categoriesRef = await firebase.firestore().collection("categories");
  const categoryRef = await categoriesRef.doc(categoryId);
  const categoryData = await categoryRef.get();
  console.log("getVocabularyById", categoryData);
  if (categoryData.exists) {
    // this.categoryDetail = categoryData
    const categoryDetail = await categoryData.data();
    const vocabCollection = await categoryRef
      .collection("vocabulary")
      .orderBy("createdAt")
      .get();
    const vocabData = await vocabCollection.docs.map(doc => {
      return { id: doc.id, ...doc.data() };
    });
    return { data: { ...categoryDetail, vocab: vocabData } };
  }
  return { error: "cannot found this category" };
};

// eslint-disable-next-line no-unused-vars
export const getVocabularyBySlug = async (levelSlug, categorySlug) => {
  const categoriesRef = await firebase.firestore().collection("categories");
  const categoryData = await categoriesRef
    .where("level.slug", "==", levelSlug)
    .where("slug", "==", categorySlug)
    .orderBy("createdAt")
    .get();
  console.log(categoryData);
  if (!categoryData.empty) {
    return await getVocabularyByIdandFilter(categoryData.docs[0].id);
  }
};

export const getVocabularyByLevel = async level => {
  const categoriesRef = await firebase.firestore().collection("categories");
  const categoryData = await categoriesRef
    .where("level.slug", "==", level)
    .orderBy("createdAt")
    .get();
  const data = await Promise.all(
    categoryData.docs.map(doc => {
      return getVocabularyByIdandFilter(doc.id);
    })
  );
  const vocab = await data.map(doc => {
    return doc.data.vocab;
  });
  const vocabAll = await [].concat.apply([], vocab);
  return vocabAll;
};

export const getVocabularyByIdandFilter = async categoryId => {
  const categoriesRef = await firebase.firestore().collection("categories");
  const categoryRef = await categoriesRef.doc(categoryId);
  const categoryData = await categoryRef.get();
  if (categoryData.exists) {
    // this.categoryDetail = categoryData
    const categoryDetail = await categoryData.data();
    const vocabCollection = await categoryRef
      .collection("vocabulary")
      .where("definition", ">", "")
      //.orderBy("createdAt")
      .get();
    const vocabData = await vocabCollection.docs.map(doc => {
      return { id: doc.id, ...doc.data() };
    });
    return { data: { ...categoryDetail, vocab: vocabData } };
  }
  return { error: "cannot found this category" };
};

export const getVocab = async (categoryId, vocabId) => {
  const categoriesRef = await firebase
    .firestore()
    .collection("categories")
    .doc(categoryId);
  const vocabRef = await categoriesRef.collection("vocabulary").doc(vocabId);
  const data = await vocabRef.get();
  return data;
};
// POST
export const addVocabByCategory = async (categoryId, vocab) => {
  const collection = await firebase.firestore().collection("categories");
  const document = await collection.doc(categoryId);
  const newVocabDocument = await document.collection("vocabulary").doc();

  const res = await firebase.firestore().runTransaction(async transaction => {
    transaction.set(newVocabDocument, {
      ...vocab,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  });
  console.log(res);
};

export const addCategory = async ({ name, image, level, slug }) => {
  const categoriesRef = await firebase.firestore().collection("categories");

  const data = {
    name,
    image,
    level,
    slug,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const res = await categoriesRef.add(data);
  return res;
};

export const addLevel = async ({ name, image, slug }) => {
  const levelRef = await firebase.firestore().collection("level");

  const data = {
    name,
    image,
    slug,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const res = await levelRef.add(data);
  return res;
};

// UPDATE
export const editVocab = async (categoryId, vocabId, payload) => {
  const categoryRef = await firebase
    .firestore()
    .collection("categories")
    .doc(categoryId);

  const vocabRef = await categoryRef.collection("vocabulary").doc(vocabId);
  await vocabRef.update({ ...payload, updatedAt: new Date() });
  console.log("editVocab", payload);
};

export const updateCategory = async (categoryId, payload) => {
  const categoryRef = await firebase
    .firestore()
    .collection("categories")
    .doc(categoryId);
  const res = await categoryRef.update({ ...payload, updatedAt: new Date() });
  console.log("updateCategory", res);
};

export const updateLevel = async (levelId, payload) => {
  const levelRef = await firebase
    .firestore()
    .collection("level")
    .doc(levelId);
  await levelRef.update({ ...payload, updatedAt: new Date() });
  console.log("updateLevel success");
};

// DELETE

export const deleteVocab = async (categoryId, vocabId) => {
  const categoryRef = await firebase
    .firestore()
    .collection("categories")
    .doc(categoryId);
  await categoryRef
    .collection("vocabulary")
    .doc(vocabId)
    .delete();
};

export const deleteCategory = async categoryId => {
  await firebase
    .firestore()
    .collection("categories")
    .doc(categoryId)
    .delete();
};

export const deleteLevel = async levelId => {
  await firebase
    .firestore()
    .collection("level")
    .doc(levelId)
    .delete();
};
