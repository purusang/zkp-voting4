# importing pandas library
import csv, os
import pandas as pd
# importing matplotlib library
import matplotlib.pyplot as plt
from os.path import dirname, abspath
from scipy.signal import savgol_filter
import numpy as np
grand_dir = dirname(dirname(abspath(__file__)))
parent_dir = dirname(abspath(__file__))

# # Signature Generation and Verification vs Time for large ring
# file_name = grand_dir +'/data/data_large_colab.csv'
# df = pd.read_csv(file_name)
# df_mean = df.groupby("ring_size").mean().reset_index()

# df_mean["signature_time"] = savgol_filter(df_mean["signature_time"]/1000, 15, 3)
# df_mean["verification_time"] = savgol_filter(df_mean["verification_time"]/1000, 15, 3)
# df_mean.plot(x="ring_size", y=["signature_time", "verification_time"] )
# plt.xlabel('Size of Ring (r)')
# plt.ylabel('Time (ms)')
# plt.title('Signature Generation and Verification time vs Ring Size')
# plt.show()
# #plt.savefig('Signature Generation and Verification vs Time')


# # Signature Generation and Verification vs Time for small ring
# file_name = grand_dir +'/data/ring_data.csv'
# df = pd.read_csv(file_name)
# df = df[df["ring_size"]<81]
# df_mean = df.groupby("ring_size").mean().reset_index()
# df_mean["signature_time"] = savgol_filter(df_mean["signature_time"] /1000, 50,4)
# df_mean["verification_time"] = savgol_filter(df_mean["verification_time"] /1000, 40,4)
# df_mean.plot(x="ring_size", y=["signature_time", "verification_time"] )
# plt.xlabel('Size of Ring (r)')
# plt.ylabel('Time (ms)')
# plt.title('Signature Generation and Verification vs Ring Size')
# plt.show()
# #plt.savefig('Signature Generation and Verification vs Time')


# RSA analysis 
# key_size,key_generation_time,encrypt_time,sign_sha1_time,decrypt_time
# Signature Generation and Verification vs Time for small ring
# file_name = parent_dir +'/data.csv'
# df = pd.read_csv(file_name)
# df_mean = df.groupby("key_size").mean().reset_index()
# # df_mean = df_mean.groupby(df_mean.arange(len(df_mean)) // 2).mean() 
# df_mean["key_generation_time"] = savgol_filter(df_mean["key_generation_time"] /1000, 5,2)
# df_mean.plot.bar(x="key_size", y=["key_generation_time"] )
# plt.xlabel('Key length (bits)')
# plt.ylabel('Time (ms)')
# plt.title('RSA key pairs genration vs Time')
# plt.show()
#plt.savefig('RSA key pairs genration vs Time')


# file_name = grand_dir +'/data/data.csv'
# df = pd.read_csv(file_name)
# df = df[df["key_size"]<4000]
# df_mean = df.groupby("key_size").mean().reset_index()
# df_mean["sign_sha1_time"] = savgol_filter(df_mean["sign_sha1_time"] /1000, 25,3)
# df_mean["verify_time"] = savgol_filter(df_mean["verify_time"] /1000,35,3)

# df_mean.plot(x="key_size", y=[ "sign_sha1_time", "verify_time"] )
# # df_mean.plot(x="key_size", y=["encrypt_time", "decrypt_time", "sign_sha1_time", "verify_time"] )
# plt.xlabel('Key length (bits)')
# plt.ylabel('time (ms)')
# plt.title('RSA Signature and Verification time vs Key Size')
# plt.show()
# #plt.savefig('RSA encryption, decryption and signature vs Time')
