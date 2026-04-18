'use client'

export default function TripGrade({ grade }: { grade: string }) {

    const getGradeColor = (grade: string) => {
        switch (grade) {
            case 'easy':
                return 'bg-green-500'
            case 'moderate':
                return 'bg-yellow-500'
            case 'difficult':
                return 'bg-red-500'
            default:
                return 'bg-gray-500'
        }
    }
    return (
        <div>
            <h1>Trip Grade</h1>
        </div>
    )
}