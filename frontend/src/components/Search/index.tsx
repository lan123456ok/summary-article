import React from "react";
import {Search, MapPin, RotateCcw, Briefcase} from "lucide-react";
import {Button} from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {cn} from "@/lib/utils.ts";

const SearchSection: React.FC = () => {
    const resetFilters = () => {
        console.log('reset')
    }

    return (
        <section className="py-6 px-4 rounded-lg shadow-sm">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-4">
                    Tóm Tắt Tin Tức Bằng AI - Nhanh Chóng Hiểu Và Đọc
                </h2>
                <div className="mb-2">
                    <span
                        className="inline-flex items-center
                        lg:h-24 lg:w-md md:h-24 md:w-md h-20 w-full
                        bg-gradient-to-bl from-violet-600 to-indigo-600
                        text-white px-4 py-2 rounded-xl text-xl font-semibold
                        transition-all duration-1500 hover:scale-105 animate-bounce relative overflow-hidden"
                        style={{
                            animation: 'gentleBounce 3s ease-in-out infinite',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        Tin tức được AI tóm tắt - Cập nhật hằng ngày, sẵn sàng cho buổi sáng của bạn
                        <div className="absolute inset-0" style={{
                            animation: 'shimmer 2.5s infinite',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                            transform: 'translateX(-100%)'
                        }}></div>
                    </span>
                </div>
                <small className="text muted-foreground flex items-center justify-center">
                    <span className="inline-flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                             className="mr-1">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                         </svg>
                        powered by Gemini
                    </span>
                </small>
            </div>

            <form className="w-full mx-auto">
                <div className="border rounded-lg shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 divide-y md:divide-y-0 md:divide-x">
                        <div className="col-span-3 md:col-span-1 lg:col-span-3 flex items-center px-4 py-3">
                            <div className="text-muted-foreground">
                                <Search className="h-5 w-5"/>
                            </div>
                            <Input
                                type="text"
                                className="w-full h-full outline-none border-none
                                focus-visible:ring-[none] shadow-none"
                                placeholder="Tìm từ khoá..."
                                name="search"
                            />
                        </div>

                        <div className="col-span-1 flex items-center">
                            <Select className="w-full" name="category">
                                <SelectTrigger
                                    className="w-full h-full bg-transparent border-none
                                focus-visible:ring-[none]"
                                >
                                    <div className="flex items-center gap-1">
                                        <div className="text-muted-foreground">
                                            <Briefcase className="h-5 w-5 mr-1"/>
                                        </div>
                                        <SelectValue placeholder="Chọn chuyên mục"
                                                     className="pl-0 text-base font-semibold"/>
                                    </div>
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Chuyên mục</SelectLabel>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        <SelectItem value="hn">Thể thao</SelectItem>
                                        <SelectItem value="hcm">Kinh tế</SelectItem>
                                        <SelectItem value="dn1">Xây dựng</SelectItem>
                                        <SelectItem value="bd">Khoa học</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="col-span-1 flex items-center">
                            <Select className="w-full"
                                    name="location">
                                <SelectTrigger className="w-full h-full bg-transparent border-none
                                focus-visible:ring-[none]">
                                    <div className="flex items-center gap-1">
                                        <div className="text-muted-foreground">
                                            <MapPin className="h-5 w-5"/>
                                        </div>
                                        <SelectValue placeholder="Chọn địa điểm"
                                                     className="pl-0 text-base font-semibold"/>
                                    </div>
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Địa điểm</SelectLabel>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        <SelectItem value="hn">Hà Nội</SelectItem>
                                        <SelectItem value="hcm">Hồ Chí Minh</SelectItem>
                                        <SelectItem value="dn1">Đà Nẵng</SelectItem>
                                        <SelectItem value="bd">Bình Dương</SelectItem>
                                        <SelectItem value="dn2">Đồng Nai</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="col-span-1 flex items-center justify-between px-4 py-2 gap-2">
                            <Button
                                type="submit"
                                className="flex-1 bg-primary hover:bg-primary/90 py-2
                                px-1 rounded-md flex items-center justify-center text-lg font-meidum"
                            >
                                <Search className="h-6 w-6"/>Tìm kiếm
                            </Button>
                            <Button
                                type="button"
                                onClick={resetFilters}
                                className="p-2 rounded-md"
                                title="Làm mới"
                            >
                                <RotateCcw className="h-6 w-6"/>
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </section>
    )
}

export default SearchSection