import prismaClient from "../../../prisma"

class GetAllCategoryService {
    async execute() {
        const categories = await prismaClient.category.findMany({
            orderBy: [{ position: 'asc' }, { created_at: 'asc' }],
            select: {
                id: true,
                title: true,
                info: true,
                image: true
            }
        })

        return categories;
    }
}

export { GetAllCategoryService }