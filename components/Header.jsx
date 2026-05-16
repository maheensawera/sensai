// 'use client'; 

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import { ChevronDown, FileText, GraduationCap, Home, LayoutDashboard, PenBox, StarIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { checkUser } from '@/lib/checkUser';
import { ThemeToggle } from './theme-toggle';

const Header = async () => {
  await checkUser();
  return (
    <header className='fixed top-0 w-full border-b bg-background80 backdrop-blur-md z-50 supports-backdrop-filter:bg-background/60'>
      <nav className='container mx-auto px-4 h-16 flex items-center justify-between'>
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Sensai Logo"
            width={200}
            height={60}
            className="h-12 py-1 w-auto object-contain drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)] dark:drop-shadow-none"
          />
        </Link>

        <div className='flex items-center space-x-2 md:space-x-4'>

          <SignedIn>
            <Link href={"/"}>
              <Button variant="outline" className="flex items-center gap-2">
                {/* shadow-[0_0_3px_white] hover:bg-white  */}
                <Home className='h-4 w-4' /> 
                <span className='hidden md:block'>Home</span> 
              </Button>
             
            </Link>
            <Link href={"/dashboard"}>
              <Button variant="outline">
                <LayoutDashboard className='h-4 w-4' />
                <span className='hidden md:block'>Industry Insights</span>
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <StarIcon className='h-4 w-4' />
                  <span className='hidden md:block'>Growth Tools</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href={"/resume"} className='flex items-center gap-2 w-full'>
                    <FileText className='h-4 w-4' />
                    <span>Build resume</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Link href={"/ai-cover-letter"} className='flex items-center gap-2 w-full'>
                    <PenBox className='h-4 w-4' />
                    <span>Cover Letter</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Link href={"/interview"} className='flex items-center gap-2 w-full'>
                    <GraduationCap className='h-4 w-4' />
                    <span>Interview Prep</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                variables: { avatarSize: "64px" },
                elements: {
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
            />
          </SignedIn>
          
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}

export default Header
