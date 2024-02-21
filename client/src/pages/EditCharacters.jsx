import React from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const EditCharacters = () => {
	// Extract the id from the url params
	const { id } = useParams();
	// React router hook for navigation
	const navigate = useNavigate();
	//
	const { fetchedAllCharacters, charLoading } = useSelector(
		(state) => state.characters
	);

	return (
		<div className='bg-gradient-to-br from-gray-800 to-gray-700 text-white min-h-[calc(100vh-64px)] p-4'>
			<div className='bg-gray-900 mx-auto rounded-lg p-6'>
				<button onClick={() => navigate(`/characters/add`)}>
					Add Character
				</button>
				{charLoading ? (
					<div className='flex items-center justify-center h-full'>
						<div className='animate-spin rounded-full border-t-2 border-b-2 border-[#8A4FFF] h-12 w-12'></div>
					</div>
				) : (
					<div className='flex flex-row gap-4 mt-4'>
						{fetchedAllCharacters
							.filter((character) => character.animeAppearences.includes(id))
							.map((filteredCharacter) => (
								<div
									key={filteredCharacter._id}
									className='bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center w-[150px] hover:bg-blue-500'
								>
									<img
										src={filteredCharacter.customImageURL}
										alt={filteredCharacter.name}
										className='object-cover rounded-md w-24 h-32 mb-2'
									/>
									<h2 className='text-white text-center'>
										{filteredCharacter.name}
									</h2>
								</div>
							))}
					</div>
				)}
			</div>
		</div>
	);
};

export default EditCharacters;
