
import { UserRepository } from './repository'
import { getTimestamp } from './utils/date'


const addUsers = () => {
	const me = {
		name: 'Matheus',
		email: 'matheusrufca@gmail.com',
		posts: {
			create: {
				title: 'My first post',
				body: 'Lots of really interesting stuff',
				slug: 'my-first-post',
			},
		}
	}

	return Promise.all([
		UserRepository.create(me)
			.then((result) => {
				console.log('user created', result)
			})
			.catch((error) => {
				console.error('unable to create user', me, error.message)
			}),

		UserRepository.upsert({
			create: {
				name: 'Lorena',
				email: 'lorena@gmail.com',
				posts: {
					create: {
						title: 'My first post',
						body: 'Lots of really interesting stuff',
						slug: `my-post-${getTimestamp()}`,
					},
				}
			},
			update: {
				posts: {
					create: {
						title: 'Another post',
						body: 'Lots of really interesting stuff',
						slug: `new-post-${getTimestamp()}`,
					}
				}
			}
		})
			.then((result) => {
				console.log('user upserted', result)
			})
			.catch((error) => {
				console.error('unable to upsert user', error.message)
			})
	])
}

const main = async () => {
	return new Promise<void>(async (resolve, reject) => {

		await addUsers()

		UserRepository.getAll()
			.then((result) => {
				console.debug('users', result)
				resolve()
			})
			.catch(error => {
				console.error('Unable to get users', error.message)
			})
	})
}

main()
	.catch(async (e) => {
		console.error(e)
	})
	.finally(() => {
		process.exit(1)
	})