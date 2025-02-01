import { Ban, UserCheck } from 'lucide-react'

const BlockButton = ({ isBlocked, onClick }) => {
	const handleClick = async () => {
		await onClick()
	}

	return (
		<button
			onClick={handleClick}
			className={`
        btn btn-sm w-full
        ${isBlocked ? 'btn-outline btn-success' : 'btn-error'}
        flex items-center gap-2
      `}
		>
			{isBlocked ? (
				<>
					<UserCheck className="size-4" />
					<span>Unblock User</span>
				</>
			) : (
				<>
					<Ban className="size-4" />
					<span>Block User</span>
				</>
			)}
		</button>
	)
}

export default BlockButton