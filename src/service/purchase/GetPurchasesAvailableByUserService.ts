import { Category } from '@prisma/client';
import prismaClient from '../../../prisma';

class GetPurchasesAvailableByUserService {
    async execute(user_id: string) {

        const purchasesProduct = await this.getPurchasesByUser(user_id);
        const allCategories = await this.getAllCategories();

        const availableCategories = [];

        allCategories.forEach(function(category) {
            const finded = purchasesProduct.find(function(purchase){
               return purchase.category_id == category.id
            })

            if(typeof finded !== 'undefined') {
                const finalObject = {
                    id: finded?.category.id, 
                    title: finded?.category.title, 
                    info: finded?.category.info,
                    type: finded?.category.type, 
                    link_type: finded?.category.link_type, 
                    link_action: finded?.category.link_action,
                    image: finded?.category.image, 
                    available: true
                }
                availableCategories.push(finalObject);
            }
        });

        availableCategories.forEach(function(category: Category) {
            const index = allCategories.findIndex(function(value) {
                if(value?.id == category?.id) {
                    return true;
                }
            })

            if(index > -1) {
                allCategories.splice(index, 1);
            }
        })

        const finalJSon = []
        availableCategories.map(function(value){ finalJSon.push(value) });

        return finalJSon;
    }

    async getAllCategories() {
        const categories = await prismaClient.category.findMany({
            orderBy: [{ position: 'asc' }, { created_at: 'asc' }],
            select: {
                id: true,
                title: true,
                info: true,
                type: true,
                link_type: true,
                link_action: true,
                image: true
            }
        });

        return categories as [Category];
    }

    async getPurchasesByUser(user_id: string) {
        const purchasesProduct = await prismaClient.purchase.findMany({
            where:{ 
                user_id: user_id
            },
            include: {
                category: true
            }
        });

        return purchasesProduct;
    }
}

export { GetPurchasesAvailableByUserService };