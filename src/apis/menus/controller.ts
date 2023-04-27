import { Prisma } from '@prisma/client'
import { Get, Route } from 'tsoa'
import MENU_ITEMS from '../../../data/menus.json'
import { MenusRepository } from '../../repositories'
import { RawMenu } from './models'


const parseCurrency = (value: string): number => parseFloat(value.substring(1))

const convertMenuItem = (model: RawMenu): Prisma.MenuCreateInput => {

	const itemPrice = model.ItemPrice ? parseCurrency(model.ItemPrice) : null
	const itemOptions = [model.ItemOption, model.ItemOption__1].filter(Boolean)
	const menuDetailListId: number | null = model.MenuListId || null
	const sectionId: number | null = model.SectionId || null

	return {
		id: model.ItemId,
		photo: model.Photo || null,
		url: model.Url || null,
		featuredMenuItem: model.FeaturedMenuItem || null,
		menuItem: {
			name: model.ItemName,
			price: itemPrice,
			calories: model.ItemCalories || null,
			options: itemOptions,
			description: model.ItemDescription || null,
			allergens: model.ItemAllergens || null,
		},
		menuDetail: {
			internalName: model.MenuInternalName,
			language: model.MenuLanguage,
			currency: model.MenuCurrency,
			publishedName: model.MenuPublishedName || null,
			listId: menuDetailListId,
		},
		section: {
			id: sectionId,
			name: model.SectionName,
			description: model.SectionDescription || null,
		}
	}
}

const loadMenusFromJson = () =>
	(MENU_ITEMS as RawMenu[]).map(convertMenuItem)

@Route('menus')
export class MenuController {
	@Get('/seed')
	async seed(): Promise<Prisma.BatchPayload> {
		const data = loadMenusFromJson()
		return await MenusRepository.createMany(data)
	}
}