//@ts-nocheck
"use server";

import { sql } from "kysely";
import { DEFAULT_PAGE_SIZE } from "../../constant";
import { db } from "../../db";
import { InsertProducts, UpdateProducts } from "@/types";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/utils/authOptions";
import { cache } from "react";
import { Result } from "postcss";
import Brands from "@/app/brands/page";

export async function getProducts(
 
  pageNo = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  brand = [],
  category = [],
  gender = "",
  priceRangeTo = 2000,
  occasions = [],
  discount = "",
  sortBy = "",
) {
  
  try {
    
    let dbQuery = db.selectFrom("products").selectAll("products");

    // Defining filter functionalities
    if (brand.length > 0) {
      const brandIds = (Array.isArray(brand))?brand:[brand];
      dbQuery= dbQuery.where('brands','regexp',`\\b(${brandIds.join('|')})\\b`);
    }
    


    if (category.length > 0) {
      const categoryIds = (Array.isArray(category))?category:[category];
      dbQuery = dbQuery.innerJoin('product_categories','product_id', 'products.id').where('category_id','in',categoryIds)
    }

    if (gender) {
      dbQuery = dbQuery.where("gender", "=", gender);
    }

    if (priceRangeTo) {
      dbQuery = dbQuery.where("price", "<=", priceRangeTo);
    }

    if (occasions.length > 0) {
      
      dbQuery = dbQuery.where("occasion", "=", occasions);
    }

    if (discount) {
      const [from, to] = discount.split("-");
      dbQuery = dbQuery.where("discount", ">=", parseFloat(from)).where("discount", "<=", parseFloat(to));
    }

    if(sortBy){
      const [field, order] = sortBy?.split('-');
      dbQuery= dbQuery.orderBy(`products.${field}`, order);
    }

    

    const { count } = await dbQuery
      .select(sql`COUNT(DISTINCT products.id) as count`)
      .executeTakeFirst();

    const lastPage = Math.ceil(count / pageSize);

    const products = await dbQuery
      .distinct()
      .offset((pageNo - 1) * pageSize)
      .limit(pageSize)
      .execute();

    const numOfResultsOnCurPage = products.length;

    return { products, count, lastPage, numOfResultsOnCurPage };
  } catch (error) {
    console.error("Error executing query: ", error);
    throw error;
  }
}


export const getProduct = cache(async function getProduct(productId: number) {
  // console.log("run");
  try {
    const product = await db
      .selectFrom("products")
      .selectAll()
      .where("id", "=", productId)
      .execute();

    return product;
  } catch (error) {
    return { error: "Could not find the product" };
  }
});

async function enableForeignKeyChecks() {
  await sql`SET foreign_key_checks = 1`.execute(db);
}

async function disableForeignKeyChecks() {
  await sql`SET foreign_key_checks = 0`.execute(db);
}

export async function deleteProduct(productId: number) {
  try {
    await disableForeignKeyChecks();
    await db
      .deleteFrom("product_categories")
      .where("product_categories.product_id", "=", productId)
      .execute();
    await db
      .deleteFrom("reviews")
      .where("reviews.product_id", "=", productId)
      .execute();

    await db
      .deleteFrom("comments")
      .where("comments.product_id", "=", productId)
      .execute();

    await db.deleteFrom("products").where("id", "=", productId).execute();

    await enableForeignKeyChecks();
    revalidatePath("/products");
    return { message: "success" };
  } catch (error) {
    return { error: "Something went wrong, Cannot delete the product" };
  }
}

export async function MapBrandIdsToName(brandsId) {
  const brandsMap = new Map();
  try {
    for (let i = 0; i < brandsId.length; i++) {
      const brandId = brandsId.at(i);
      const brand = await db
        .selectFrom("brands")
        .select("name")
        .where("id", "=", +brandId)
        .executeTakeFirst();
      brandsMap.set(brandId, brand?.name);
    }
    return brandsMap;
  } catch (error) {
    throw error;
  }
}

export async function getAllProductCategories(products: any) {
  try {
    const productsId = products.map((product) => product.id);
    const categoriesMap = new Map();

    for (let i = 0; i < productsId.length; i++) {
      const productId = productsId.at(i);
      const categories = await db
        .selectFrom("product_categories")
        .innerJoin(
          "categories",
          "categories.id",
          "product_categories.category_id"
        )
        .select("categories.name")
        .where("product_categories.product_id", "=", productId)
        .execute();
      categoriesMap.set(productId, categories);
    }
    return categoriesMap;
  } catch (error) {
    throw error;
  }
}

export async function getProductCategories(productId: number) {
  try {
    const categories = await db
      .selectFrom("product_categories")
      .innerJoin(
        "categories",
        "categories.id",
        "product_categories.category_id"
      )
      .select(["categories.id", "categories.name"])
      .where("product_categories.product_id", "=", productId)
      .execute();

    return categories;
  } catch (error) {
    throw error;
  }
}



// exporting add product function
export async function addProducts(product:InsertProducts, categories){
  const productEntity = await db.insertInto('products').values(product).executeTakeFirst();
  await db.insertInto('product_categories').values(categories.map((category)=>({
    product_id:productEntity.insertId,
    category_id:category.value
  }))).execute();
};


// update product functionality
export async function updateProduct(product:UpdateProducts, categories){
  const productEntity = await db.updateTable('products').set(product).where('id','=',product.id).executeTakeFirst();
  const productCategories = await db.selectFrom('product_categories').selectAll().where('product_id','=',product.id).execute();
  const categoryIds = productCategories.map((productCategory) =>productCategory.category_id);
  const notExistingCategories = categories.filter((category)=>{
    if(categoryIds.find(id=>id==category.value)){
      return false;
    };
    return true;
  });
  const removedCategoryIds =  categoryIds.filter((id)=>{
    if(categories.find(category=>id==category.value)){
      return false;
    };
    return true;
  });
  if(removedCategoryIds.length){
    await db.deleteFrom('product_categories').where('product_id','=',product.id).where('category_id','in',removedCategoryIds).execute();
  }
  if(notExistingCategories.length){
    await db.insertInto('product_categories').values(notExistingCategories.map((category)=>({
      product_id:product.id,
      category_id:category.value
    }))).execute();
  }
};
