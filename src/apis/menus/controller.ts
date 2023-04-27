import { Prisma } from '@prisma/client'
import defaultTo from 'lodash/defaultTo'
import { Get, Route } from 'tsoa'
import MENU_ITEMS from '../../../data/menus.json'
import { MenusRepository } from '../../repositories'
import { RawMenu } from './routes'

const convertMenuItem = (rawItem: RawMenu): Prisma.MenuCreateInput => {

	const itemPrice = rawItem.ItemPrice ? parseFloat(rawItem.ItemPrice.substring(1)) : null
	const itemOptions = [rawItem.ItemOption, rawItem.ItemOption__1].filter(Boolean)
	const menuDetailListId: number | null = rawItem.MenuListId || null
	const sectionId: number | null = rawItem.SectionId || null

	return {
		id: rawItem.ItemId,
		photo: defaultTo(rawItem.Photo, null),
		url: defaultTo(rawItem.Url, null),
		featuredMenuItem: defaultTo(rawItem.FeaturedMenuItem, null),
		menuItem: {
			name: rawItem.ItemName,
			price: itemPrice,
			calories: defaultTo(rawItem.ItemCalories, null),
			options: itemOptions,
			description: defaultTo(rawItem.ItemDescription, null),
			allergens: defaultTo(rawItem.ItemAllergens, null),
		},
		menuDetail: {
			internalName: rawItem.MenuInternalName,
			language: rawItem.MenuLanguage,
			currency: rawItem.MenuCurrency,
			publishedName: defaultTo(rawItem.MenuPublishedName, null),
			listId: menuDetailListId,
		},
		section: {
			id: sectionId,
			name: rawItem.SectionName,
			description: defaultTo(rawItem.SectionDescription, null),
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