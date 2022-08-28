import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn } from "typeorm"
import { Profile } from "../../user_profile/entity/User_profile"

@Entity({name: "adminuser"})
export class AdminUser extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column("varchar", { nullable: true, length: 200 })
    firstName: string

    @Column("varchar", { nullable: true, length: 200 })
    lastName: string

    @Column("varchar", { nullable: true, length: 200 })
    email: string

    @Column("varchar", { nullable: true, length: 200 })
    password: string

    @OneToOne(() => Profile)
    @JoinColumn()
    profile: Profile
}
